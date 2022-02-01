const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json())
app.use(express.urlencoded({extended: true}))


const db = 'mongodb://localhost/Test'
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true,})
const udb = mongoose.connection;
udb.on('error', console.error.bind(console,'connection error:'))
udb.once('open', () => {
    console.log('db connected')
})

const dbURL= 'mongodb://localhost/Test'; 
mongoose.connect(dbURL);

const userSchema = new mongoose.Schema({
    name: String,
    role: String,
    age: { type: Number, min: 18, max: 70 },
    createdDate: { type: Date, default: Date.now}
})
const collectionName = 'user'
const user = mongoose.model('User',userSchema, collectionName)

app.post('/newUser', (req, res) => {
    console.log(`Post /newUser: ${JSON.stringify(req.body)}`)
    const newUser = new user();
    newUser.name = req.body.name;
    newUser.role = req.body.role;
    newUser.save((err, data) => {
        if (err) {
            return console.error(err)
        }
        console.log(`new user save: ${data}`)
        res.send(`done ${data}`)
    })
})

app.get('/user/:name', (req, res) => {
    let userName = req.params.name;
    user.find({ name: userName}, {}, {}, (err, data) => {
        res.send('Complete')
    })
})

app.get("/user", (req, res) =>{
    student.find({}, (err, data) => {
        if (err) return console.log(`Oops! ${err}`);
        //You can access the result from the call back function  
        let result = JSON.stringify(data);
        console.log(`data = ${result}`);
        res.send(result);
    });
})




app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`App Server listen on port: ${port}`)
})