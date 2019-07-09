// GameController.js

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
    try {
        var homeTeamName    = null,
            homeTeamColour  = null,
            awayTeamName    = null,
            awayTeamColour  = null;
        
        if (typeof req.body.homeTeamName === "string") {
            var homeTeamName = req.body.homeTeamName;       
        }
        if (typeof req.body.homeTeamColour === "string") {
            var homeTeamColour = req.body.homeTeamColour;       
        }
        if (typeof req.body.awayTeamName === "string") {
            var awayTeamName = req.body.awayTeamName;       
        }
        if (typeof req.body.awayTeamColour === "string") {
            var awayTeamColour = req.body.awayTeamColour;       
        }
        var state = Game.resetGame(homeTeamName, homeTeamColour, awayTeamName, awayTeamColour);
    } 
    catch(err) {
        res.status(500).json({errors:"Server error POST /game"});          
    }
    res.status(200).json(state);     
});

// Updates game parameters
router.put('/', function (req, res) {
    try {
        var homeTeamName    = null,
            homeTeamColour  = null,
            awayTeamName    = null,
            awayTeamColour  = null;
        
        if (typeof req.body.homeTeamName === "string") {
            var homeTeamName = req.body.homeTeamName;       
        }
        if (typeof req.body.homeTeamColour === "string") {
            var homeTeamColour = req.body.homeTeamColour;       
        }
        if (typeof req.body.awayTeamName === "string") {
            var awayTeamName = req.body.awayTeamName;       
        }
        if (typeof req.body.awayTeamColour === "string") {
            var awayTeamColour = req.body.awayTeamColour;       
        }
        var state = Game.updateGame(homeTeamName, homeTeamColour, awayTeamName, awayTeamColour);
    } 
    catch(err) {
        res.status(500).json({errors:"Server error PUT /game"});          
    }
    res.status(200).json(state); 
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
        res.status(500).json({errors:"Server error POST /game/clock"});         
    }
    res.status(200).json(clock);
});

// Starts/stops/updates the clock
router.put('/clock', function (req, res) {
    try {
        var clock = Game.updatePeriodClock(null, null);        
    }
    catch(err) {
        res.status(500).json({errors:"Server error PUT /game/clock"});         
    }
    res.status(200).json(clock);
});

// Stops the clock
router.delete('/clock', function (req, res) {
    try {
        var clock = Game.stopPeriodClock();       
    }
    catch(err) {
        res.status(500).json({errors:"Server error DELETE /game/clock"});         
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
        res.status(500).json({errors:"Server error GET /game/score"});         
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
        res.status(500).json({errors:"Server error PUT /game/score"});         
    }
    res.status(200).json(score);
});


module.exports = router;