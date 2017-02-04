//web framework for node.js
var express= require('express')
//Gives an instance of express
var app=express();
//Used for post request and forms
var bodyParser=require('body-parser');
//MongoDB Object modeling tool designed to work in asynchronous environment
var mongoose = require('mongoose');

Genre=require('./models/Genre');
//connect to mongoose
mongoose.connect('mongodb://127.0.0.1:27017/bookstore');
//database Object
var db= mongoose.connection;
//handle route note:/ represents the home page

//Use would be always used first by express
//app.use(express.static('public'));
//Set second static direcotry
//app.use(express.static('src/views'));

//The below function takes request and response
app.get('/',function(req,res){
    //sends the response to the browser
    res.send("Hello World");
});
app.get('/books',function(req,res){
    //sends the response to the browser
    res.send("Hello Books");
});
app.get('/api/genres',function(req,res){
  Genre.getGenres(function(err,genres){
  if(err){
     throw err;
    }
    res.json(genres);
  });
});

var port =5000;
//Specify a port to listen for express
app.listen(port,function(err){
 console.log('Running on port '+port);
});
