const express = require("express");
const mongo = require("mongodb");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
const fetch = require("node-fetch");

const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/myDatabase";

MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();
});

app.get('/populate', (req, res, next) => {
    fs.readFile('./users.json', function(err, data) {
        let newData = JSON.parse(data);

        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db("myDatabase");
            dbo.collection("users").insertMany(newData, function(err, res) {
              if (err) throw err;
              console.log("Number of users inserted: " + res.insertedCount);
              db.close();
            });
          });
    });
});

app.get('/mongo', (req, res, next) => {
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("myDatabase");
        dbo.collection("users").find({}).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          db.close();
        });
      });
})

app.post('/login', (req, res, next) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("myDatabase");
        var query = { email: req.body.email };
        dbo.collection("users").find(query).toArray(function(err, result) {
            if (result) {
                req.session.email = newUser.email
            }
          if (err) throw err;
          console.log(result);
          db.close();
        });
    });


        try {
            const newUser = {
                id: newId(),
                name: req.body.name,
                email: req.body.email,
                username: req.body.username
            }
    
            if (!newUser.name || !newUser.email || !newUser.username) {
                res.send("insert details")
            } else {
                newuser.push(newUser);
                res.send(newuser);
            }
        } catch (err) {
            console.log(err)
        }
});

app.get('/users', (req, res, next) => {
    fs.readFile('./users.json', function(err, data) {
        res.write(data);
        return res.end();
    });
});

app.get('/name', (req, res, next) => {
    fs.readFile('./users.json', 'utf8', function(err, data) {
        let arrNames = [];
        let pData = JSON.parse(data);
        for (let i = 0; i < pData.length; i++) {
            let names = {
                name: pData[i].name
            }
            arrNames.push(names);
        }

        res.send(arrNames);
    });
});

app.get('/email', (req, res, next) => {
    fs.readFile('./users.json', 'utf8', function(err, data) {
        let arrEmail = [];
        let eData = JSON.parse(data);
        for (let i = 0; i < eData.length; i++) {
            let emails = {
                email: eData[i].email
            }
            arrEmail.push(emails);
        }

        res.send(arrEmail);
    });
});

app.get('/username', (req, res, next) => {
    fs.readFile('./users.json', 'utf8', function(err, data) {
        let arrUsernames = [];
        let uData = JSON.parse(data);
        for (let i = 0; i < uData.length; i++) {
            let usernames = {
                username: uData[i].username
            }
            arrUsernames.push(usernames);
        }

        res.send(arrUsernames);
    });
});

app.get('/delete', (req, res, next) => {
    fs.readFile('./users.json', 'utf8', function(err, data) {
        let newData = JSON.parse(data);
        let x = newData.pop();
        res.send(newData);
    });
});

app.get('/deleteall', (req, res, next) => {
    fs.readFile('./users.json', 'utf8', function(err, data) {
        let newerData = JSON.parse(data);
        newerData.splice(0, 10);
        res.send(newerData);
    });
});

app.post('/newuser', (req, res, next) => {
    fs.readFile('./users.json', 'utf8', function(err, data) {
        let newuser = JSON.parse(data);

        const newId = () => {
            if (newuser.length > 0) {
                return newuser[newuser.length - 1].id + 1;
            } else {
                return 1;
            }
        }
        try {
            const newUser = {
                id: newId(),
                name: req.body.name,
                email: req.body.email,
                username: req.body.username
            }
    
            if (!newUser.name || !newUser.email || !newUser.username) {
                res.send("insert details")
            } else {
                newuser.push(newUser);
                res.send(newuser);
            }
        } catch (err) {
            console.log(err)
        }
    });
});


app.use((req, res, next) => {
    fetch('http://jsonplaceholder.typicode.com/users')
    .then(res => res.json())
    .then(json => {
        let arr = [];
        for (let i = 0; i < json.length; i++) {
            let users = {
                id: json[i].id,
                name: json[i].name,
                username: json[i].username,
                email: json[i].email,
            }
            arr.push(users);

            stringUsers = JSON.stringify(arr, null, 2);
            fs.writeFile('./users.json', stringUsers, function (err) {
                if (err) throw err;
            });
        }
        return res.send("Welcome, head over to /users")
    }).catch(err => err)
});

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});