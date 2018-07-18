//const PORT = process.env.PORT || 3000;


var express = require('express');
//var urlShortenerController = require('./controllers/urlShortenerController');

//copied from controller
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
// base 58 for encoding and decoding functions
var base58 = require('./base58');
//copied ^

var app = express();

app.set('port', (process.env.PORT || 3000));

//app.listen(PORT);

// extra - from other project (GRAB THE URL MODEL)
var Url = require('./models/url');
//extra ^

// connect to database (extra)
//mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name, {autoIndex: false});
mongoose.connect('mongodb://test:test123@ds139841.mlab.com:39841/urls')

// urlencodedParser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// set up template engine
app.set('view engine', 'ejs');


// static files
app.use(express.static('assets'));

// fire controllers
//urlShortenerController(app);
app.get('/', function(req, res){
  // route to serve up the homepage (index.html)
  res.sendFile('index.html', {root: './'});
});

app.post('/', urlencodedParser, function(req, res){
  console.log(req.body);

  //var dataObj = {data: req.body}
  var urlLong = req.body.inputurl;
  var urlShort = ''; // the shortened URL we will return
  var urlPrefix = urlLong.substring(0,5);

  if (urlPrefix === "https" || urlPrefix === "http:"){
    urlLong = urlLong;
  }
  else {
    urlLong = "http://" + urlLong;
  }

/**if (urlLong.length >= 2000) {
//res.writeHead(200, {'Content-Type': 'text/html'});
res.render('error', {data: urlLong});
}
else {
res.render('next', {data1: urlLong});
}**/

  if (urlLong.length >= 2000) {
    res.render('error');
  }
  else {

// check if url already exists in database
Url.findOne({long_url: urlLong}, function(err, doc){
  if (doc){
  // URL has already been shortened
  // base 58 encode the unique _id of that document and construct the short URL
  urlShort = config.webhost + base58.encode(doc._number);

  // since the document exists, we return it without creating a new entry
  //res.send({'urlShort': urlShort});

  res.render('next', {data2: urlShort});
} else {
  // The long URL was not found in the long_url field in our urls
  // collection, so wee need to create a new entry
  var newUrl = Url({
    long_url: urlLong
  });

  // save the new link
  newUrl.save(function(err) {
    if (err){
      console.log(err);
    }

    // construct the short url
    urlShort = config.webhost + base58.encode(newUrl._number);

    //res.send({'urlShort': shortUrl});

    res.render('next', {data2: urlShort});

  });
};
});
}
});

app.get('/:encoded_id', function(req, res){
  var base58Id = req.params.encoded_id;
  var id = base58.decode(base58Id);

  // check if url already exists in database
  Url.findOne({_number: id}, function (err, doc){
    if (doc) {
      // found an entry in the DB, redirect the user to their destination
      res.redirect(doc.long_url);
    } else {
      // nothing found, take 'em home
      res.redirect(config.webhost);
    }
  });

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
