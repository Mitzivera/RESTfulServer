//Built in Node.js modules
var fs = require('fs');
var path = require('path');

// NPM modules 
var express = require('express');
var sqlite3 = require('sqlite3');

var public_dir = path.join(__dirname, 'public');
var db_filename = path.join(__dirman, 'db', 'stpaul_crime.sqlite3');

//opening the sqlite 3- the data 
var db = new sqlite3.Database(db_filename,sqlite3.OPEN_READONLY, (err) =>{
	if(err){
		console.log("Error Opening "+ db_filename);
	}else{
		console.log("Now connected to "+ db_filename);
	}
});

app.use (express.static(public_dir));


console.log("Now listening on port" + port);
var server = app.listen(port); 


