const express = require("express");

const Shouts = require("../shouts/shouts-model.js");

const router = express.Router();

router.use(express.json());

//----------------------------------------------------------------------------//
// GET / middleware handler...
// 
// This version uses the async/await syntax. Refer to my repo with async/await
// samples to learn more about async/await.  It's a little eaier to read this
// syntax, to reason about it, to troubleshoot it, etc.
//----------------------------------------------------------------------------//
router.get("/", async (req, res, next) => {
  try {
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
    const messageOfTheDay = process.env.MOTD || 'Helo World!';
    const shouts = await Shouts.find();
    res.status(200).json({ message: messageOfTheDay, shouts });
  } catch (err) {
    // here we are using the error handling middleware, defined below.
    next(err);
  }
});

//----------------------------------------------------------------------------//
// GET / middleware handler... 
// 
// This version uses the typical Promise .then/.catch syntax. 
//----------------------------------------------------------------------------//
// router.get("/", (req, res, next) => {
//   Shouts.find()
//     .then(shouts => {
//       const messageOfTheDay = process.env.MOTD || 'Helo World!';
//       res.status(200).json({ message: messageOfTheDay, shouts });
//     })
//     .catch(err => {
//       next(err);
//     });
// });

router.get("/shouts", (req, res, next) => {
  Shouts.find()
    .then(shouts => {
      res.status(200).json(shouts);
    })
    .catch(error => next(error));
});

router.post("/shouts", (req, res, next) => {
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

