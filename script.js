var express = require('express');
var app = express();
app.set("view engine", "ejs");
app.use(express.json());
var path = require('path');
var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;  
app.set('views', path.join(__dirname, 'views'));
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended:  false  }));
app.use('/html_finalprojimages', express.static(__dirname + '/html_finalprojimages'));
var Connection = require('tedious').Connection;  
    var config = {  
        server: 'dbchu.database.windows.net',  //update me
        authentication: {
            type: 'default',
            options: {
                userName: 'cyleeax', //update me
                password: '*HKust980507'  //update me
            }
        },
        options: {
            // If you are on Microsoft Azure, you need encryption:
            encrypt: true,
            database: 'db',
            port: 1433  //update me
        }
    };  

var connection = new Connection(config);  
    connection.on('connect', function(err) {  
        if(err)
        console.log("Error");  
    });
    
connection.connect();

app.listen(3000);
app.post("/recommendation",express.json(),function(req,res){
    var name = req.body.new_recommendation;
    var request = new Request("INSERT INTO recommendations (recommendation) VALUES (@recommendation);", function(err) {  
        if (err) {  
           console.log(err);}  
       });  
    request.addParameter('recommendation', TYPES.NVarChar,name);   
    connection.execSql(request);
    request.on("requestCompleted", function (rowCount, more) {
        res.redirect('/'); 
    }); 
});
app.get('/', function(req, res) {
    var result = [];
    var request = new Request("SELECT * FROM recommendations;", function(err) {  
        if (err) {  
            console.log(err);}  
        });        
        request.on('row', function(columns) { 
            
           columns.forEach(function(column) {  
                result.push({
                    recommendation: column.value
                });
               });
        });  
        request.on('done', function(rowCount, more) {  
            console.log(rowCount + ' rows returned');  
            });  
            connection.execSql(request); 
        request.on("requestCompleted", function (rowCount, more) {
            res.render("index", {userData : result});
            });

});