const knex = require('knex');

// We needed to hard code "environment" to "development" because our knexfile.js
// configuration file for knex only has a "development" property.
//
// As a refresher, you can access properties on an object using the array index
// syntax. For example, if you have an object that looks like this:
// 
// const myobj = {
//      property1: "value1",
//      property2: "value2"   
// }
// 
// ...then you can access myobj.property1, and you can also access 
// myobj['property1']. 
// 
// This latter syntax is how we are accessing the object from the export in
// knexfile.js. 
// 
// But if we let "environment" get its value from the NODE_ENV environment
// variable, then when running in Heroku, it will get the value "production".
// This is because Heroku automatically sets NODE_ENV to "production". But
// trying to access require('../knexfile.js')['production'] will fail, because
// the export in knexfile.js doesn't include a property named "production". 
//
// To get around this, we are just hard-coding "environment" to "development"
// (to match the property in the knexfile.js export.) 
// 
// We could also handle this by creating a "production" property in the
// knexfile.js export. But as we haven't learned about knex yet, it is easiest
// to just hard-code it to what exists in the export ("development"). 
// 
// We could also rename the "development" property in knexfile.js to
// "production", and set a local environment variable (or name/value pair in
// .env, for use with the dotenv package) for NODE_ENV and set it to
// "production". 

// const environment = process.env.NODE_ENV || 'development';
const environment = 'development';
const config = require('../knexfile.js')[environment];

module.exports = knex(config);
