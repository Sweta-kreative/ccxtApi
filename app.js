var express = require('express');
var app = express();
//var db = require('./db');

var TxController = require('./repository/txController');
var blockchainController = require('./controller/blockchain.js');
app.use('/tx', TxController);
app.use('/blockchain', blockchainController);


module.exports = app;