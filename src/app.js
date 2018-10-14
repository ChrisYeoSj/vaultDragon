const express = require('express');
const app = express();
//get the service of entitys
const EntityService = require('./services');
const {Router} = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator/check');
const bodyParser = require('body-parser');

const moment = require('moment');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

router.get('/', function (req, res) {
    res.send('<b>VaultDragon Coding Test</b>');
});

router.route('/object')
.post(async (request, response) => {
    // validate value, and deal with a seemingly dynamic key
    try {
        validateRequestBody(request.body);
        // looks like validation has passed.
        const key = Object.keys(request.body)[0];
        console.log(`//info key: ${key} obtained`);
        const value = request.body[key];
        console.log(`//info value: ${value} obtained`);
        const entity = await EntityService.createEntity(key, value);
        if (entity.error){
            response.status(500).send(error);
        } else {
            response.status(200).send(entity);
        }

    } catch (exception){
      console.log('//error ' + exception.message);
      response.status(400).send(exception.message);
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
], async (request, response) => {

    //everything seems to be valid
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({ errors: errors.array() });
    }

    try {
        const entity = await EntityService.findEntity(request.params.key, request.query.timestamp);
        if (entity){
          response.status(200).send(entity);
        } else {
          response.status(204).send(entity);
        }

    } catch (exception){
        console.log('//error ' + exception.message);
        response.status(400).send(exception.message);
    }
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

app.use((err, request, response, next) => {
  response.status(500).send({error: err.message});
})

module.exports = app;
