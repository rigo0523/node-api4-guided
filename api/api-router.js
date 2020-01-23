const express = require('express');
const net = require('net');
const socket = require('net').Socket;

const Shouts = require('../shouts/shouts-model.js');

const router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
  // This "message of the day" variable was created to demonstrate creating
  // environment variables in the Heroku platform. You can define environment
  // variables that Heroku will create in the OS environment it makes for your
  // app by clicking on the "Settings" tab for your app in Heroku.
  //
  // Our app will not be retrieving the PORT variable from a definition in this
  // way... Heroku automatically creates the PORT environment variable for us
  // (we don't need to tell it to). But there are times when we still want other
  // configuration environment variables that our app can use. And since we
  // don't have access to the shell environment before our application is
  // executed by Heroku, we need to define the variables we want Heroku to
  // create and export for our app using this feature (Settings). 
  const messageOfTheDay = process.env.MOTD;
  res.status(200).json({ motd: messageOfTheDay });
});

//----------------------------------------------------------------------------//
// This is just a little something to be able to see what the app is listening
// on in Heroku... just hit /api/addr and it will show you. You can get the
// local (and remote!) addresses from the req.connection object. Remote address
// is the address and port of the machine sending the request. Neat!
//----------------------------------------------------------------------------//
router.get('/addr', (req, res) => {
  const addr = `server listening on ${req.connection.localAddress}:${req.connection.localPort}`;
  res.status(200).json({ address: addr });
})

router.get('/shouts', (req, res, next) => {
  Shouts.find()
    .then(shouts => {
      res.status(200).json(shouts);
    })
    .catch(error => next(error));
});

router.post('/shouts', (req, res, next) => {
  Shouts.add(req.body)
    .then(shout => {
      res.status(201).json(shout);
    })
    .catch(error => next(error));
});

router.use(errorHandler);

function errorHandler(error, req, res, next) {
  // do something with error before responding
  // like saving it to a database, sending a mail to the admin
  // or using an external logging service
  res.status(500).json(error.message);
}

module.exports = router;
