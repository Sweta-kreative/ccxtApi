var mongoose = require('mongoose');  
var txSchema = new mongoose.Schema({  
  hash: String,
  from: String,
  to: String,
  block: String,
  value: Number});
mongoose.model('tx', txSchema);

module.exports = mongoose.model('tx');