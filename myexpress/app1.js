/*****************************************Qiao start******************************************************/
var express = require("express");
var http = require("http");
var path = require('path');
var app = express();
/********************************************Qiao*********************************************************/


// Make our db accessible to our router
// we're adding thatMonk connection object to every HTTP request (ie: "req") our app makes
app.use(function(req,res,next){
    req.db = db;
    next();
});

// Database
// These lines tell our app we want to talk to MongoDB, we're going to use Monk //to do it, and our database is located at localhost:27017/nodetest1. Note that //27017 is the default port your MongoDB instance should be running on.
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/myexpress');

/**********************************************Qiao*******************************************************/
  //Express's routing system
  app.get("/", function(req, res) {
    res.end("Welcome to the lucky 7!");
  });

  app.get("/bet", function(req, res) {
	
	// get request parameters  
	var id = req.param('id');
	var coin = req.param('coin');
	var bet = req.param('bet');

	//calculate cash depending on parameters
	var cash = coin*bet;

	//random generate row1, row2 and row3: integer: 0~6
	var row1 = Math.floor(Math.random() * 7);
	var row2 = Math.floor(Math.random() * 7);
	var row3 = Math.floor(Math.random() * 7);

	//calcualte the result cents
	var win = 0;

	//any 1 cherry
	if(row1 === 4 || row2 === 4 || row3 === 4) { win =  Math.floor (2 * cash );}

	//3 any bar
	if(( 1 <= row1 && row1 <=3 ) && ( 1 <= row2 && row2 <=3 ) && ( 1 <= row3 && row3 <=3 ) ) { win =   Math.floor (3 * cash * 100);}

	//any 2 cherry
	if(row1 === 4 && row2 === 4 ) { win =  Math.floor (10 * cash );}
	if(row1 === 4 && row3 === 4 ) { win =  Math.floor (10 * cash );}
	if(row2 === 4 && row3 === 4 ) { win =  Math.floor (10 * cash );}

	
	//3  bar 1, 2, 3
	if(row1 === 1 && row2 === 1 && row3 === 1) { win =  Math.floor (20 * cash );}
	if(row1 === 2 && row2 === 2 && row3 === 2) { win =  Math.floor (50 * cash );}
	if(row1 === 3 && row2 === 3 && row3 === 3) { win =  Math.floor (100 * cash );}

	//3  cherries
	if(row1 === 4 && row2 === 4 && row3 === 4) { win =  Math.floor (150 * cash );}

	//3  luky 7
	if(row1 === 5 && row2 === 5 && row3 === 5) { win =  Math.floor (250 * cash );}

	//3  7
	if(row1 === 6 && row2 === 6 && row3 === 6) { win =  Math.floor (1000 * cash );}

	//3  7  and bet = 3
	if(row1 === 6 && row2 === 6 && row3 === 6 && bet === 3) { win =  Math.floor (5000 * cash );}

	res.json({
	    id: id,
            win: win,
            coin: coin,
            bet: bet,
            cash: cash,
            row1: row1,
            row2: row2,
            row3: row3,} );

/*******************************save into DB**************************************/
	 var db = req.db;
         var collection = db.get('resultscollection');
  
        collection.insert({
	    id: id,
            win: win,
            coin: coin,
            bet: bet,
            cash: cash,
            row1: row1,
            row2: row2,
            row3: row3,});

  });

app.get('/hello', function(req, res) {
    res.render('hello', { title: 'Hello, World!!' })
});

/* GET Userlist page. */
app.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

//get top win
app.get('/tops', function(req, res) {
    var db = req.db;
    var collection = db.get('resultscollection');

       collection.find({}, {limit:3,  sort: [['win', -1]]},function(e,docs){
        res.render('tops', {
            "tops" : docs
        }) });

//    collection.find({}, {limit:3,  sort: [['win', -1]]},function(e,docs){
//        res.json(docs) });
});


//get top win
app.get('/awards', function(req, res) {
    var id = req.param('id');	
    var db = req.db;
    var collection = db.get('resultscollection');

       collection.find({}, {limit:3,  sort: [['win', -1]]},function(e,docs){
        res.render('tops', {
            "tops" : docs
        }) });

//    collection.find({}, {limit:3,  sort: [['win', -1]]},function(e,docs){
//        res.json(docs) });

});


http.createServer(app).listen(3000);


