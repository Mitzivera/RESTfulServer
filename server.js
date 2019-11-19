var fs = require('fs');
var path = require('path');

var express = require('express');
var sqlite3 = require('sqlite3');
var bodyParser = require('body-parser');
var js2xmlparser = require("js2xmlparser");

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
    var commacode = "";
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

           if(req.query.hasOwnProperty('format')){
            res.writeHead(200,{'Content-Type':'text/xml'});
            res.write(js2xmlparser.parse("Codes", reports));
            res.end();
            }else if(req.query.hasOwnProperty(',')){


            }else{
                res.write(JSON.stringify(reports, null, ' '));
                res.end(); 
            } 
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
           if(req.query.hasOwnProperty('format')){
            res.writeHead(200,{'Content-Type':'text/xml'});
            res.write(js2xmlparser.parse("Neighborhoods", reports));
            res.end();
            }else {
               // res.writeHead(200,{'Content-Type':'text/html'});
           res.write(JSON.stringify(reports, null, 4));
           //console.log(js2xmlparser.parse("codes", reports)); // writes in xml format 
          // console.log(JSON.stringify(reports, null, ' ')); // write in the correct format
           res.end();
            }
           
       }
    });  
});
/*
*
case_number (TEXT): unique id from crime case
date_time (DATETIME): date and time when incident took place
code (INTEGER): crime incident type numeric code
incident (TEXT): crime incident description (more specific than incident_type)
police_grid (INTEGER): police grid number where incident occurred
neighborhood_number (INTEGER): neighborhood id where incident occurred
block (TEXT): approximate address where incident occurred
I19245014": {
    "date": "2019-10-30",
    "time": "23:43:19",
    "code": 700,
    "incident": "Auto Theft",
    "police_grid": 95,
    "neighborhood_number": 4,
    "block": "79X 6 ST E"
  },
*/
app.get('/incidents',(req, res) => {
    var case_number = "";
    var code = "";
    var incident = "";
    var police_grid = "";
    var neighborhood_number = "";
    var block = "";
    var date = "";
    var time = "";
    var reports= {};
    db.all("SELECT * FROM Incidents ORDER BY date_time", (err,data) => {
       if(err)
       {
           console.log("Error accessing the tables");
       }
       else
       {
           for(let i=data.length-1; i>-1; i--)
           {
               let innerObj = {};
                case_number = "I" + data[i]["case_number"];
                let hold = data[i]["date_time"];
                let pos = hold.indexOf("T");
                date = hold.substring(0,pos);
                innerObj["date"] = hold.substring(0,pos);
                innerObj["time"] = hold.substring(pos+1);
                innerObj["code"] = data[i]["code"];
                innerObj["incident"] = data[i]["incident"];
                innerObj["police_grid"] = data[i]["police_grid"];
                innerObj["neighborhood_number"] = data[i]["neighborhood_number"];
                innerObj["block"] = data[i]["block"];
                reports[case_number] = innerObj;
           }
           if(req.query.hasOwnProperty('format')){
            res.writeHead(200,{'Content-Type':'text/xml'});
            res.write(js2xmlparser.parse("Incidents", reports));
            res.end();
            }else{
            //res.writeHead(200,{'Content-Type':'text/html'});
           res.write(JSON.stringify(reports, null, 4));
           res.end();
            }
           
           
       }
    });  
});

app.put('/new-indidicent', (req,res) =>{
    var case_number;
    var data;
    var time;
    var code;
    var incident;
    var police_grid;
    var neighborhood_number;
    var block;

    if(case_number == req.query.case_number){
        res.status(500).send("Error: Case Number already exist");
    }





});


console.log('Now listening on port ' + port);
app.listen(port);
