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


var app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get('/codes', (req, res) => {
    var code = "";
    var reports= {};
    var commaCode = "";
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
                console.log('inside the first loop');
                res.writeHead(200,{'Content-Type':'text/xml'});
                res.write(js2xmlparser.parse("Codes", reports));
                res.end();
            }else if(req.query.hasOwnProperty('codes')){
                console.log("inside this second method");
               // console.log(req.query.codes);
                commaCode = req.query.codes;
                //console.log(commacode);
                var arrayofCodes = commaCode.split(",");
                console.log(arrayofCodes);
                for (let i = 0; i<arrayofCodes.length; i++){
                    console.log('inside the loop');
                    db.all("SELECT * FROM Codes WHERE codes=?"[i], (err, data) =>{
                        if (err){
                            console.log("Error accessing the tables");
                        }else{
                            code = "c" + data[i]["code"];
                            reports[code] = data[i]["incident_type"];
                        }
                        res.write(JSON.stringify(reports, null, ' '));
                        //res.end(); 
                    });

                }
            }else{
                console.log('inside the 3rd');
                res.write(JSON.stringify(reports, null, ' '));
                res.end(); 
            } 
       }
    });  
});



app.get('/neighborhoods',(req, res) => {
    var neighId = "";
    var reports= {};
    var commaNeighbor;
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
            }else if (req.query.hasOwnProperty('id')){
                commaNeighbor = req.query.id;
                var arrayofNeighborhood = commaNeighbor.split(',');
                console.log(arrayofNeighborhood);
                for (let i =0; i<arrayofNeighborhood; i++){
                    db.all("SELECT * FROM Neighborhoods WHERE id=?", (err,data) => {
                        if(err){
                            console.log("Error accessing the tables");
                        }else{
                            for(let i=0; i< data.length; i++){
                                neighId = "N" + data[i]["neighborhood_number"];
                                reports[neighId] = data[i]["neighborhood_name"];
                            }
                            res.write(JSON.stringify(reports, null, 4));
                        }
                    });
                }
            }else {
           res.write(JSON.stringify(reports, null, 4));
           res.end();
            } 
       }
    });  
});

app.get('/incidents',(req, res) => {
    var case_number = "";
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
            }else if(req.query.hasOwnProperty('start_date')){

            }else if (req.query.hasOwnProperty('end_date')){

            }else if (req.query.hasOwnProperty('code')){

            }else if (req.query.hasOwnProperty('grid')){

            }else if (req.query.hasOwnProperty('id')){

            }else if(req.query.hasOwnProperty('limit')){

            } else{
            //res.writeHead(200,{'Content-Type':'text/html'});
           res.write(JSON.stringify(reports, null, 4));
           res.end();
            }
           
           
       }
    });  
});

app.put('/new-incident', (req,res) =>{
    

    var innerObj = {
        date : req.body.date,
        time : req.body.time,
        code : req.body.code,
        incident : req.body.incident,
        police_grid: req.body.police_grid, 
        neighborhood_number: req.body.neighborhood_number,
        block:req.body.block 

    }
    var incident = {};
    var case_number = "I" + req.body.case_number;
    incident[case_number] = innerObj;
    db.all("SELECT * FROM Incidents WHERE case_number=?", [req.body.case_number], (err,data) => {
        if(err)
        {
            db.run("INSERT INTO Incidents (case_number, date , time , code, incident, police_grid, neighborhood_number, block) VALUES(req.body.case_number, req.body.date, req.body.time,req.body.code, req.body.incident, req.body.police_grid,req.body.neighborhood_number,  req.body.block)", (err,data)=>{
                if(err)
                {
                    console.log("Error entering incident");
                }
                else
                {
                    res.status(200).send('Success!');
                }
            });
        }
        else
        {
            if(req.body.case_number === data["case_number"])
            {
                res.status(500).send('Error: incident already exists');
            }
        }
    });
    
});


console.log('Now listening on port ' + port);
app.listen(port);
