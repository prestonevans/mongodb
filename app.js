const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const path = require("path"); 
app.get('/',(req,res) => { 
  res.sendFile(path.join(__dirname+'/index.html')); 
}); 

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
    firstName: String,
    lastName: String,
    emailAddress: String,
    age: Number,
    role: String,
    password: String,
    createdDate: { type: Date, default: Date.now}
})
const collectionName = 'user'
const user = mongoose.model('User',userSchema, collectionName)

app.post('/newUser', (req, res) => {
    console.log(`Post /newUser: ${JSON.stringify(req.body)}`)
    const newUser = new user();
    newUser.firstName = req.body.firstName;
    newUser.lastName = req.body.lastName;
    newUser.emailAddress = req.body.emailAddress;
    newUser.age = req.body.age
    newUser.role = req.body.role;
    newUser.password = req.body.password;
    newUser.save((err, data) => {
        if (err) {
            return console.error(err)
        }
        console.log(`new user save: ${data}`)
        res.send(`${newUser.firstName} has been added to the database <a href='/'>Home</a>`)
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

app.post('/searchByFirst', async (req, res) => {
    const search = req.body.name;
    try {
        const results = await user.find({firstName: search})
        console.log(results)
        res.send(results.length !== 0 ? JSON.stringify(results) : 'No results found')
    } catch {
        res.send('Ooops')
    }
})

 app.post('/updateUserRole', (req, res) => {
    console.log(`POST /updateUserRole: ${JSON.stringify(req.body)}`);
    let matchedName = req.body.name;
    let newrole = req.body.role;
    user.findOneAndUpdate( {name: matchedName}, {role: newrole},
        { new: true }, //return the updated version instead of the pre-updated document
        (err, data) => {
            if (err) return console.log(`Oops! ${err}`);
            console.log(`data -- ${data.role}`)
            let returnMsg = `user name : ${matchedName} New role : ${data.role}`;
            console.log(returnMsg);
            res.send(returnMsg);
        });
 })
app.get('/users', async (req,res) => {
    try {
        const data = await user.find({})
        res.send(JSON.stringify(data))
    } catch(e) {
        res.send('OOOOops')
    }
})
app.get('/sortZ-A', async (req,res) => {
    try {
        const data = await user.find({}).sort({lastName: 1})
        res.send(JSON.stringify(data))
    } catch(e) {
        res.send('OOOOops')
    }
})
app.get('/sortA-Z', async (req,res) => {
    try {
        const data = await user.find({}).sort({lastName: -1})
        res.send(JSON.stringify(data))
    } catch(e) {
        res.send('OOOOops')
    }
})
 app.post('/removeUser', async (req, res) => {
     let matchedName = req.body.name;
     console.log(matchedName)
    try {
        await user.findOneAndRemove({firstName: matchedName})
        res.send(`Deleted ${matchedName}`)
    } catch {
        res.send('Ooops something went wrong')
    }
 })

app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`App Server listen on port: ${port}`)
})