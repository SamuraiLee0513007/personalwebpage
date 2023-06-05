var express = require('express');
var fs = require('fs'); 
var app = express();
app.use(express.json());
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended:  false  }));
app.use('/html_finalprojimages', express.static(__dirname + '/html_finalprojimages'));
app.get('/', function(req, res) {
    res.sendFile('/index.html', {root: __dirname })
});
app.listen(3000);
app.post("/recommendation",express.json(),function(req,res){
    var name = req.body.new_recommendation;
    fs.appendFile(__dirname+"/index.html",name+'\n', (err) => {
        if (err) {
          console.log(err);
        }
      });
      res.sendFile('/index.html', {root: __dirname })
});