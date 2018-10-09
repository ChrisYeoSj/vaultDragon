const express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var { MONGO_URL } = require('./constants').database;
var { check, validationResult } = require('express-validator/check');
var Entity = require('./models/Entity');
const moment = require('moment');
var app = express();
const router = express.Router();
// Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = process.env.MONGODB_URI || MONGO_URL;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

router.get('/', function (req, res) {
    res.send('<b>VaultDragon Coding Test</b>');
});

router.route('/object')
.post(function(request, resp){
    // validate value & deal with a seemingly dynamic key
    try {
      const validationResult = validateRequestBody(request.body);
      if (validationResult){
        // looks like validation has passed.
          const key = Object.keys(request.body)[0];
          console.log(`//info key: ${key} obtained`);
          const value = request.body[key];
          console.log(`//info value: ${value} obtained`);
          const entity = new Entity(
              {
                  key,
                  value,
                  timestamp: moment.utc(),
              }
          );
          entity.save();
          resp.status(200).send(entity);
      }
    } catch (exception){
      console.log('//error ' + exception.message);
      resp.status(400).send(exception.message);
    }
})

router.route('/object/:key?')
.get([
  // key must exist
  check('key').exists(),
  ///ts must be valid, return true or false
  check('timestamp').custom((ts, {req}) =>{
    // check for empty string
    if (!ts || ts.length ===0){
      // reject empty string, since it isnt valid
      return false;
    }
    // check if timestamp is valid
    return moment.unix(ts).isValid()
  }).optional(),
], function(request, resp){
    //everything seems to be valid
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return resp.status(422).json({ errors: errors.array() });
    }

    Entity.findOne({key: request.params.key}).then(function(error, result){
      console.log(error);
      console.log(result);
    })

})

function validateRequestBody(body) {
  if (Object.keys(body).length === 0){
    // looks like theres no key. lets throw an error exception with error message;
    throw new Error('Request contains no key/value pairs');
  } else {
    // looks like theres at least one key
    // lets take the first key
    const key = Object.keys(body)[0];
    const value = body[key];
    if (value === null){
      // looks like theres an empty value
      // lets throw an error exception;
      throw new Error('Requests value is empty!');
    } else {
      //seems like everything is a ok.
      // lets return a value true
      return true;
    }
  }
}


app.use('/', router);
app.listen(3000, () => {
    console.log('Server is up and running on port number 3000');
});
