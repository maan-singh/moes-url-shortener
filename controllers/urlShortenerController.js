/**var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('config.js', { root: './' });
// base 58 for encoding and decoding functions
var base58 = require('base58.js', { root: './' });
**/

/**
// create the counters schema with an _id field and a seq field
var CounterSchema = mongoose.Schema({
  _id: {type: String, required: true},
  seq: { type: Number, default: 0 }
});

// create a model from that schema
var counter = mongoose.model('counter', CounterSchema);

// create a schema for our links
var urlSchema = new mongoose.Schema({
  _id: {type: Number, index: true},
  long_url: String,
  created_at: Date
});

// The pre('save', callback) middleware executes the callback function
// every time before an antry is saved to the urls collection.
urlSchema.pre('save', function(next){
  var doc = this;
  // find the url_count and increment it by 1
  counter.findByIdAndUpdate({_id: 'url_count'}, {$inc: {seq: 1} }, function(error, counter) {
    if (error)
    return next(error);
    // set the _id of the urls collection to the incremented value of the counter
    doc._id = counter.seq;
    doc.created_at = new Date();
    next();
  });
});

var Url = mongoose.model('Url', urlSchema);
**/

//**mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name);

//**var urlencodedParser = bodyParser.urlencoded({ extended: false });

//**module.exports = function(app){

//  app.get('/moesurl', function(req, res){
    // route to serve up the homepage (index.html)
//    res.sendFile('index.html', { root: './'});
//  });

  /**app.post('/moesurl', urlencodedParser, function(req, res){
    console.log(req.body);

    var dataObj = {data: req.body}
    var urlLong = data.inputurl;
    var urlShort = ''; **/ // the shortened URL we will return
    //var urlPrefix = urlLong.substring(0,5);

    /**if (urlPrefix === "https" || urlPrefix === "http:"){
    urlLong = urlLong;
  }
  else {
  urlLong = "http://" + urlLong;
}

if (urlLong.length >= 2000) {
//res.writeHead(200, {'Content-Type': 'text/html'});
res.render('error', {data: urlLong});
}
else {
res.render('next', {data1: urlLong});
}**/

// check if url already exists in database
/**Url.findOne({long_url: urlLong}, function(err, doc){
  if (doc){
    // URL has already been shortened
    // base 58 encode the unique _id of that document and construct the short URL
    urlShort = config.webhost + base58.encode(doc._id);

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
      urlShort = config.webhost + base58.encode(newUrl._id);

      //res.send({'urlShort': shortUrl});

      res.render('next', {data2: urlShort});

    });
  };
});
});**/
//};

// end of app.js
// listen to port
//app.listen(process.env.PORT || 3000);
//console.log('You are listening to port 3000');
