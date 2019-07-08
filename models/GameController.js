// GameStateController.js

var express = require('express');
var router = express.Router();
router.use(express.json());

var Game = require('./Game');


// Returns full game state
router.get('/', function (req, res) {
    try 
    {
        var state = Game.getState();        
    } 
    catch(err)
    {
        res.status(500).json({errors:"Server error GET /game"});          
    }
    res.status(200).json(state); 
});

// Starts a new game
router.post('/', function (req, res) {
    try 
    {
        /*
        move this to graphics class
        
        var homeTeamName = "HOME";
        var awayTeamName = "AWAY";
        if (typeof req.body.homeTeamName === "string") {
            homeTeamName = req.body.homeTeamName;       
        }
        if (typeof req.body.awayTeamName === "string") {
            awayTeamName = req.body.awayTeamName;       
        }
        */
        var state = Game.resetGame();
    } 
    catch(err)
    {
        res.status(500).json({errors:"Server error POST /game"});          
    }
    res.status(200).json(state);     
});

// Updates game parameters
router.put('/', function (req, res) {
    res.end(json({message: "Update game not implemented yet"}));
});

// Resets the clock
router.post('/clock', function (req, res) {
    if (typeof req.body.seconds === "number") {
        var seconds = req.body.seconds;       
    }
    try {
        var clock = Game.resetPeriodClock(seconds);        
    }
    catch(err) {
        res.status(500).json({errors:"Server error POST /clock"});         
    }
    res.status(200).json(clock);
});

// Starts the clock
router.put('/clock', function (req, res) {
    try {
        var clock = Game.startPeriodClock();        
    }
    catch(err) {
        res.status(500).json({errors:"Server error PUT /clock"});         
    }
    res.status(200).json(clock);
});

// Stops the clock
router.delete('/clock', function (req, res) {
    try {
        var clock = Game.stopPeriodClock();       
    }
    catch(err) {
        res.status(500).json({errors:"Server error DELETE /clock"});         
    }
    res.status(200).json(clock);
});

// Gets score
router.get('/score', function (req, res) {
    if (typeof req.body.team === "string") {
        var team = req.body.team;       
    }
    try {
        var score = Game.getScore(team);       
    }
    catch(err) {
        res.status(500).json({errors:"Server error GET /score"});         
    }
    res.status(200).json(score);
});

// Updates score
router.put('/score', function (req, res) {
    var team        = null,
        scoreType   = null,
        changeMethod = null,
        amount      = null;
        
    if (typeof req.body.team === "string") {
        team = req.body.team;       
    }
    if (typeof req.body.scoreType === "string") {
        scoreType = req.body.scoreType;       
    }
    if (typeof req.body.changeMethod === "string") {
        changeMethod = req.body.changeMethod;       
    }
    if (typeof req.body.amount === "number") {
        amount = req.body.amount;       
    }
    
    try {
        var score = Game.updateScore(team, scoreType, changeMethod, amount);       
    }
    catch(err) {
        res.status(500).json({errors:"Server error PUT /score"});         
    }
    res.status(200).json(score);
});


module.exports = router;