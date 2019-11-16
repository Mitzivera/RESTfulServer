var fs = require('fs');
var path = require('path');

var express = require('express');
var bodyParser = require('body-parser');

var port = 8000;

//var user_file = path.join(__dirname, 'users.json');
var db_filename = path.join(__dirname, 'db', 'stpaul_crime.sqlite3');

var reports;
fs.readFile(db_filename, (err, data) => {
    if (err) {
        console.log('Error opening ' + db_filename);
    }
    else {
        console.log('Now connected to ' + db_filename);
    }
});

var app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get('/codes', (req, res) => {
    reports = {reports:[]};
    db.all("SELECT * FROM Codes", (err,data) => {
        if(err)
        {
            console.log("Error couldn't access the table");
        }
        else
        {
            for( i in data)
            {
                reports = JSON.parse(i[""])
            }
        }
    });

    
    
});

app.put('/add-user', (req, res) => {
    var new_user = {
        id: parseInt(req.body.id, 10),
        name: req.body.name,
        email: req.body.email
    };
    var has_id = false;
    for (let i = 0; i < users.users.length; i++) {
        if (users.users[i].id === new_user.id) {
            has_id = true;
        }
    }
    if (has_id) {
        res.status(500).send('Error: user id already exists');
    }
    else {
        users.users.push(new_user);
        fs.writeFile(user_file, JSON.stringify(users, null, 4), (err) => {
            res.status(200).send('Success!');
        });
    }
});

app.post('/update-user', (req, res) => {
    var edit_user = {
        id: parseInt(req.body.id, 10),
        name: req.body.name,
        email: req.body.email
    };
    var user_index = -1;
    for (let i = 0; i < users.users.length; i++) {
        if (users.users[i].id === edit_user.id) {
            user_index = i;
        }
    }
    if (user_index < 0) {
        res.status(500).send('Error: user id does not exist');
    }
    else {
        users.users[user_index].name = edit_user.name;
        users.users[user_index].email = edit_user.email;
        fs.writeFile(user_file, JSON.stringify(users, null, 4), (err) => {
            res.status(200).send('Success!');
        });
    }
});

app.delete('/remove-user', (req, res) => {
    var delete_id = parseInt(req.body.id, 10);
    
    var user_index = -1;
    for (let i = 0; i < users.users.length; i++) {
        if (users.users[i].id === delete_id) {
            user_index = i;
        }
    }
    if (user_index < 0) {
        res.status(500).send('Error: user id does not exist');
    }
    else {
        users.users.splice(user_id, 1);
        fs.writeFile(user_file, JSON.stringify(users, null, 4), (err) => {
            res.status(200).send('Success!');
        });
    }
});

console.log('Now listening on port ' + port);
app.listen(port);
