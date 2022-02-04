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
app.use(express.static(__dirname + '/public'));

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
        res.send(`${newUser.firstName} has been added to the database <a href='/'>Back</a>`)
    })
})

app.get("/user", (req, res) =>{
    student.find({}, (err, data) => {
        if (err) return console.log(`Oops! ${err}`);
        //You can access the result from the call back function  
        let result = JSON.stringify(data);
        res.send(result);
    });
})

app.post('/searchByFirst', async (req, res) => {
    const search = req.body.name;
    try {
        const results = await user.find({firstName: search}).collation( { locale: 'en', strength: 2 } )
        res.send(results.length !== 0 ? JSON.stringify(results) : 'No results found')
    } catch {
        res.send('Ooops')
    }
})

 app.post('/updateUserRole', async (req, res) => {
    const matchedName = req.body.name;
    const newrole = req.body.role;
    const isUser = await user.find({firstName: matchedName}).collation( { locale: 'en', strength: 2 } );
    if(isUser.length === 0) {
        res.send('No user with that name')
    } else {
        user.findOneAndUpdate( {firstName: matchedName}, {role: newrole},
            { new: true }, //return the updated version instead of the pre-updated document
            (err, data) => {
                if (err) return console.log(`Oops! ${err}`);
                let returnMsg = `user name : ${matchedName} New role : ${data.role}`;
                res.send(returnMsg);
            }).collation( { locale: 'en', strength: 2 } );
    }
 })

app.get('/users', async (req,res) => {
    try {
        const data = await user.find({})
        res.send(`${data.length === 0 ? 'No data' : `<a href='/'>Back</a>${JSON.stringify(data)}`}`)
    } catch(e) {
        res.send('OOOOops')
    }
})

app.get('/sortA-Z', async (req,res) => {
    try {
        const data = await user.find({}).sort({lastName: 1})
        res.send(`${data.length === 0 ? 'No data' : `<a href='/'>Back</a>${JSON.stringify(data)}`}`)
    } catch(e) {
        res.send('OOOOops')
    }
})

app.get('/sortZ-A', async (req,res) => {
    try {
        const data = await user.find({}).sort({lastName: -1})
        res.send(`${data.length === 0 ? 'No data' : `<a href='/'>Back</a>${JSON.stringify(data)}`}`)
    } catch(e) {
        res.send('OOOOops')
    }
})

app.post('/removeUser', async (req, res) => {
    let matchedName = req.body.name;
    const isUser = await user.find({firstName: matchedName}).collation( { locale: 'en', strength: 2 } )
    try {
       if(isUser.length != 0) {
           await user.findOneAndRemove({firstName: matchedName}).collation( { locale: 'en', strength: 2 } )
           res.send(`Deleted ${matchedName}`)
       } else {
           res.send('No user with that name...')
       }
   } catch {
       res.send('Ooops something went wrong')
   }
})

app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`App Server listen on port: ${port}`)
})