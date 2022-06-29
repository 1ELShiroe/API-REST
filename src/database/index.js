const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL+ "/API")
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('Mongo Error:'));

mongoose.Promise = global.Promise;

module.exports = mongoose;