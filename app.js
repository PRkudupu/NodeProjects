//web framework for node.js
var express   =require('express')
//Gives an instance of express
var app       =express();
//Used for post request and forms
var bodyParser=require('body-parser');
//MongoDB Object modeling tool designed to work in asynchronous environment
var mongoose  =require('mongoose');
//logger middleware function using the given format and options
var morgan    =require('morgan');
//Reference connection string
var config    =require("./config") 
//Defines a compact and self-contained way for securely transmit information between parties as a JSON object
var jwt       =require('jwt-simple');
//Port where it would be listening
var port      =process.env.PORT || 5000;
//Get body parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Log to console
app.use(morgan('dev'));

//Set debug to true
mongoose.set('debug', true);

//Enable cors 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
//Connect to the database
mongoose.connect(config.database);

app.get('/', function(req, res, next) {
  // Handle the get for this route
});

app.post('/', function(req, res, next) {
 // Handle the post for this route
});

Genre=require('./models/Genre');
//Company=require('./models/company');
Product=require('./models/product');

//log connection state
console.log(mongoose.connection.readyState);


//Load the model for company
Company=require('./models/company');

//Using find to fetch the collection
app.get('/api/Companys',function(req,res){
  //Filter query
  var query=req.query;
    Company.find(query,function(req,companys){
    console.log(companys);
    //sends the response to the browser
    res.send(companys);
});
});
//Load the model for users
User=require('./models/user');
//Custom middleware to find if user exists
app.use('/api/Users/:_id',function(req,res,next){
  console.log('custom middleware');
      //Find based on ID
       User.findById(req.params._id, function(err, user) {
             if (err)
                res.status(500).send(err);
              //fetch user and send it to next function
             else if(user)
             {
                    req.user=user;
               next();
                res.status(200).send('Success');
             }
            else
            {
              res.status(404).send('no user found');
            }
        });
});

/**
 * 
 * GET
 */
//Using find to fetch all the users in the db
app.get("/api/Users",function(req,res){
//Filter query
  var query=req.query;
      User.find(query, function(err, user) {
           if (err)
                res.send(err);
            else
                res.send(user)
            //res.json(user);
        });
  });
  //Get specific record
  app.get("/api/Users/:_id",function(req,res){
      //use custom middleware
       res.json(req.user)
  });
//Use bodyParser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
/**
 * POST
 */
app.post('/api/Users',function(req, res) {
  var users = new User(req.body);
  //save users
   users.save(function(err) {
    //Check for error
    if (err) {
      return res.send(err);
    }
    else{
    console.log('Success');
    res.send(users)
    }
  });
  //res.send('Responding');*/
 });
 
 /**
  * PUT
 */
  app.put('/api/Users/:_id',function(req,res){
      //use custom middleware tp fetch the document
        req.user.firstName=req.body.firstName;
        req.user.lastName=req.body.lastName;
        req.user.save(function(err){
           if (err)
                res.status(500).send(err);
              //fetch user and send it to next function
             else {
                 res.json(req.user);
             }
        });
    });
/**
  * PATCH
 */
 app.patch('/api/Users/:_id',function(req,res){
     //We do not want ot update the ID. We need to delete ID from the body parser
     if(req.body._id)
     {
        delete req.body_id;
     }
     //Fetch all the keys in the body parser
      for(var u in req.body){
      //assignind the body content to the req object
        req.user[u]=req.body[u];
      }
        req.user.save(function(err){
           if (err)
                res.status(500).send(err);
              //fetch user and send it to next function
             else {
                 res.json(req.user);
             }
        });
       
    });
/**
  * DELETE
 */  
app.delete('/api/Users/:_id',function(req,res){
  //delete the document frmom the mongodb collection
  req.user.remove();
 
});
//Specify a port to listen for express
app.listen(port,function(err){
 console.log('Running on port '+port);
});
