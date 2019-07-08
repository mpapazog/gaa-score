// app.js
var express = require('express');
var app = express();

var GameController = require('./models/GameController');
app.use('/api/v1/game', GameController);
//var GraphicsController = require('./models/GraphicsController');
//app.use('/api/v1/graphics', GraphicsController);
app.use(express.static('html'));

module.exports = app;