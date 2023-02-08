const express = require('express');
const bodyParser = require('body-parser')
const usersRepo = require('./repositories/users');
const cookieSession = require('cookie-session');
const users = require('./repositories/users');

const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieSession({
    keys: ['awrG@#42Asdvn49nvF$b']
}));

app.get('/signup', (req,res) => {
    res.send(`
    <div>
        Your user id is: ${req.session.userId}
        <form method="POST">
            <input name="email" placeholder="email" ></input>
            <input name="password" placeholder="password" ></input>
            <input name="passwordConfirmation" placeholder="confirm password"></input>
            <button>Sign up</button>
        </form>
    </div>
    `)
});


app.post('/signup', async (req, res) => {
    const {email, password, passwordConfirmation} = req.body

    const existingUser = await usersRepo.getOneBy({ email })

    if (existingUser) {
        return res.send('Email in use.')
    }

    if (password !== passwordConfirmation) {
        return res.send('Passwords do not match.')
    }

    //create user in our repo
    const user = await usersRepo.create({email, password})

    //store id of that user inside cookies
    req.session.userId = user.id

    res.send('Account created successfully!')
})

app.get('/signout', (req, res) => {
    req.session = null;
    res.send('You are logged out');
})

app.get('/signin', (req, res) => {
    res.send(`
    <div>
        <form method="POST">
        <input name="email" placeholder="email" ></input>
        <input name="password" placeholder="password" ></input>
        <button>Sign in</button>
        </form>
    </div>
    `)
})

app.post('/signin', async (req, res) => {
    const {email, password} = req.body

    const user = await usersRepo.getOneBy({ email })

    const validPassword = await usersRepo.comparePasswords(user.password, password)

    if (!user) {
        return res.send('No user found with that email.')
    } else if (!validPassword) {
        return res.send('Incorrect password.')
    } else {
        req.session.userId = user.id
        return res.send('Log in successful.')
    }

})

app.listen(3000, () => {
    console.log('Listening')
});