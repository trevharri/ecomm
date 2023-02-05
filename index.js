const express = require('express');
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req,res) => {
    res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email" ></input>
            <input name="password" placeholder="password" ></input>
            <input name="passwordConfirmation" placeholder="confirm password"></input>
            <button>Sign up</button>
        </form>
    </div>
    `)
});


app.post('/', (req, res) => {
    console.log(req.body)
    res.send('Account created successfully!')
})

//email=meow&password=mewo&passwordConfirmation=meow
//['email=meow', 'password=mewo', 'passwordConfirmation=meow']


app.listen(3000, () => {
    console.log('Listening')
});