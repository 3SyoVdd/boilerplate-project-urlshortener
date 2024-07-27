require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

//const bodyParser = require('body-parser');
//app.use(bodyParser);

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
/*
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
*/
//von https://stackoverflow.com/questions/24330014/bodyparser-is-deprecated-express-4
/*
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
*/

// das funktioniert anscheindend ohne probleme. und damit funktioniert es auch
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


require('dotenv').config();
const dotenv = require('dotenv');
dotenv.config({path:'sample.env'});
let mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;
const shortUrlSchema = new mongoose.Schema({
  id: Number,
  longUrlString: { type: String, required: true },
   //ist eigentlich die _id nachdem die depperte mongo db aber keine id mit zahlen macht sondern irgendwas. brauche ich hier einen wert
});

let urlInstanz = mongoose.model('urlInstanz', shortUrlSchema)





app.post("/api/shorturl/", (req, res) => {
console.log ("ich gehe2 ", req.body.url);
  //console.log ("so ein schleiss")
//schauen ob es nur zahlen sind
  var reg = /^\d+$/;

  if (reg.test(req.body.url)){
    console.log ("url sind nur zahlen")
    findUrl(req.body.url)
    
  }else{
    var regValideUrl = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/

  if (regValideUrl.test(req.body.url)){
    console.log ("url ist valide")
    urlInstanz
      .find() //finden
      .exec()//ausführen.
      .then(data => {
        new urlInstanz (
          {id: data.length + 1, //die länge der oben gefundenen daten +1
          longUrlString: req.body.url }
        )
      .save()//speichern
      .then(() => {
            res.json({
              original_url: req.body.url,
              short_url: data.length + 1
            });
          })
          .catch(err => {
            res.json(err);
          });

      });
  }else{
    res.json({ error: 'invalid url' });
  };//ende if valide url  
    
  
}//ende else

})//ende funktion
//  reg.test(req.body.url)
//  console.log ("test1",reg.test(req.body.url))

 //reg.test("123456");
  //console.log ("test2",reg.test("123456"))
  


/*
app.post('/api/shorturl', (req, res) => {
  console.log(req.body);
}
);
*/
app.get("/api/shorturl/:number", function(req, res) {
  console.log ("ich bin der get teil", req.params.number,parseInt(req.params.number))
  if (!isNaN(parseInt(req.params.number))){
  urlInstanz
    .find({ id: parseInt(req.params.number) })//suche nach der id. 
    .exec()
    .then(url => {
      console.log("redirect zu", url[0]["longUrlString"]);
      res.redirect(url[0]["longUrlString"]);
    });
  }else{
    return res.json({ error: 'invalid url' });
  }
});



app.get("/api/shorturl", function (req, res) {
  //console.log("reqiop",req.ip);
  console.log("ich funze" );
   let urlWert = req.params;
  //console.log (urlWert);
    let ip = req.ip;
    let language = req.headers["accept-language"];
    let software = req.headers["user-agent"];

      console.log (ip, language, software)
   return res.json({original_url : 'https://freeCodeCamp.org', 
                    short_url : 1});


//rückgabewerte
  //{ original_url : 'https://freeCodeCamp.org', short_url : 1}
  


});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});








const createAndSaveUrl = (url, done) => {
  //herausfinden wie viele elemente schon im urlschema sind
 
    
  
  console.log ("ich bin create and save url");
  var urlvar = new urlInstanz({longUrlString: url});
 // urlvar.save().then((val)=> {return ({ original_url : url, short_url : url._id})});
  //urlvar.save();
  //return ({ original_url : url, short_url : url._id})

  urlvar.save().then(function(urlvar) {
     console.log(urlvar._id);
  });


  /*
  urlvar.save().then(function(urlvar) {
    console.log("warum gehst nicht", urlvar._id)
      return ({ original_url : url, short_url : urlvar._id})
  });
*/
  
  /*=> {
      res.json({ original_url : url, short_url : url._id});
    })
    .catch(err => {
      res.json(err);
    });
    */
    /*
    then(
             res.json({ original_url : url, short_url : url._id}),
             err => console.error(`Something went wrong: ${err}`),
           );*/
  /*
  url.save(function(err, data){
    if (err) return console.lerror(err);
    done(null, data)
  })  
*/
};

const findUrl = (urlId, done) => {
    url.find({_id: urlId}, function (err, longUrl) {
      if (err) return console.log(err);
      done(null, longUrl[0]);
    });
  };