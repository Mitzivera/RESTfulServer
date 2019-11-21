var fs = require('fs');
var path = require('path');

var express = require('express');
var sqlite3 = require('sqlite3');
var bodyParser = require('body-parser');
var js2xmlparser = require("js2xmlparser");

var port = 8000;
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
    var arrayofCodes;
    db.all("SELECT * FROM Codes", (err,data) => {
       if(err){
           console.log("Error accessing the tables");
       }else{
           for(let i=0; i< data.length; i++)
           {
               code = "c" + data[i]["code"];
               reports[code] = data[i]["incident_type"];
           }

           if(req.query.hasOwnProperty('format')){

                res.writeHead(200,{'Content-Type':'text/xml'});
                res.write(js2xmlparser.parse("Codes", reports));
                res.end();

            }else if(req.query.hasOwnProperty('codes')){

                console.log("inside this second method");
                commaCode = req.query.codes;
                arrayofCodes = commaCode.split(",");
                console.log(arrayofCodes);
                for (let j = 0; j<arrayofCodes.length; j++){
                    db.all("SELECT * FROM Codes WHERE codes=?", [arrayofCodes], (err,data) =>{
                        if (err){
                            console.log("Error accessing the tables");
                        }else{
                            code = "c" + data[j]["code"];
                            reports[code] = data[j]["incident_type"];
                        }
                        res.write(JSON.stringify(reports, null, ' '));
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
    var arrayofNeighborhood;
    db.all("SELECT * FROM Neighborhoods", (err,data) => {
       if(err){
           console.log("Error accessing the tables");
       }else{
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
                arrayofNeighborhood = commaNeighbor.split(',');
                console.log(arrayofNeighborhood);

                for (let i =0; i<arrayofNeighborhood; i++){
                    db.all("SELECT * FROM Neighborhoods WHERE id=?",[arrayofNeighborhood],(err,data) => {
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
       if(err){
           console.log("Error accessing the tables");
       }else {
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
                console.log(req.query.start_date);

                db.all("SELECT * FROM Codes WHERE codes=?", [req.query.start_date], (err,data) =>{
                    if (err){
                        console.log("Error accessing the tables");
                    }else{
                        code = "c" + data[j]["code"];
                        reports[code] = data[j]["incident_type"];
                    }
                   // res.write(JSON.stringify(reports, null, ' '));
                });
                


            }else if (req.query.hasOwnProperty('end_date')){
                console.log(req.query.end_date);
                db.all("SELECT * FROM Codes WHERE codes=?", [req.query.end_date], (err,data) =>{
                    if (err){
                        console.log("Error accessing the tables");
                    }else{
                        code = "c" + data[j]["code"];
                        reports[code] = data[j]["incident_type"];
                    }
                   // res.write(JSON.stringify(reports, null, ' '));
                });

            }else if (req.query.hasOwnProperty('code')){ 
                console.log(req.query.code);
                db.all("SELECT * FROM Codes WHERE codes=?", [req.query.code], (err,data) =>{
                    if (err){
                        console.log("Error accessing the tables");
                    }else{
                        code = "c" + data[j]["code"];
                        reports[code] = data[j]["incident_type"];
                    }
                   // res.write(JSON.stringify(reports, null, ' '));
                });

            }else if (req.query.hasOwnProperty('grid')){
                console.log(req.query.grid);
                db.all("SELECT * FROM Codes WHERE codes=?", [req.query.grid], (err,data) =>{
                    if (err){
                        console.log("Error accessing the tables");
                    }else{
                        code = "c" + data[j]["code"];
                        reports[code] = data[j]["incident_type"];
                    }
                   // res.write(JSON.stringify(reports, null, ' '));
                });

            }else if (req.query.hasOwnProperty('id')){
                console.log(req.query.id);
                db.all("SELECT * FROM Codes WHERE codes=?", [req.query.id], (err,data) =>{
                    if (err){
                        console.log("Error accessing the tables");
                    }else{
                        code = "c" + data[j]["code"];
                        reports[code] = data[j]["incident_type"];
                    }
                   // res.write(JSON.stringify(reports, null, ' '));
                });

            }else if(req.query.hasOwnProperty('limit')){
                var thelimit = req.query.limit;
                for (let i = 0; i<thelimit; i++){
                    console.log(req.query.code);
                db.all("SELECT * FROM Codes ", (err,data) =>{
                    if (err){
                        console.log("Error accessing the tables");
                    }else{
                        
                    }
                    res.write(js2xmlparser.parse("Incidents", reports));
                });

                }
                

            } else{
            //res.writeHead(200,{'Content-Type':'text/html'});
            res.write(js2xmlparser.parse("Incidents", reports));
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
            console.log("The value doesn't ")
        }
        else
        { 
            if(data.length == 0)
            {
                db.run("INSERT INTO Incidents (case_number, date_time , code, incident, police_grid, neighborhood_number, block) VALUES(req.body.case_number, req.body.date_time,req.body.code, req.body.incident, req.body.police_grid,req.body.neighborhood_number,  req.body.block)", (err,data)=>{
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
        }
    });
    
});


console.log('Now listening on port ' + port);
app.listen(port);
