var fs = require('fs')
var path = require('path')

var express = require('express')
var sqlite3 = require('sqlite3')
var bodyParser = require('body-parser')

var port = 8000;

//var user_file = path.join(__dirname, 'users.json');
var db_filename = path.join(__dirname, 'db', 'stpaul_crime.sqlite3');

var db = new sqlite3.Database(db_filename, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.log('Error opening ' + db_filename);
    }
    else {
        console.log('Now connected to ' + db_filename);
    }
});

var reports;


var app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get('/codes', (req, res) => {
    var code = "";
    var reports= {};
    db.all("SELECT * FROM Codes", (err,data) => {
       if(err)
       {
           console.log("Error accessing the tables");
       }
       else
       {
           for(let i=0; i< data.length; i++)
           {
               code = "c" + data[i]["code"];
               reports[code] = data[i]["incident_type"];
           }
           res.writeHead(200,{'Content-Type':'text/html'});
           res.write(JSON.stringify(reports));
           res.end();
       }
    });  
});

app.get('/neighborhoods',(req, res) => {
    var neighId = "";
    var reports= {};
    db.all("SELECT * FROM Neighborhoods", (err,data) => {
       if(err)
       {
           console.log("Error accessing the tables");
       }
       else
       {
           for(let i=0; i< data.length; i++)
           {
               neighId = "N" + data[i]["neighborhood_number"];
               reports[neighId] = data[i]["neighborhood_name"];
           }
           res.writeHead(200,{'Content-Type':'text/html'});
           res.write(JSON.stringify(reports));
           res.end();
       }
    });  
});

console.log('Now listening on port ' + port);
app.listen(port);
