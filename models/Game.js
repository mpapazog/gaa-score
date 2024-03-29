// Game.js

const EventEmitter = require('events');

var SELF = null;
var TIMEOUT = null;

class Score {
    constructor() {
        this.goals  = 0;
        this.points = 0;
    }
    
    get() {
        return {
            goals   : this.goals,
            points  : this.points           
        };
    }
}

class Team {
    constructor(name, colour) {
        this.name   = name;
        this.colour = colour;
        this.score  = new Score();
    } 
    
    getInfo() {
        return {
            name    : this.name,
            colour  : this.colour
        };
    }    
    
    updateInfo(name, colour) {
        var retVal = null;
        
        if (name != null) {
            this.name   = name;
        }
        if (colour != null) {
            this.colour = colour;
        }
    }    
}

class Clock {
    constructor(id, startTime, endTime, allowOverrun) {
        this.id             = id;
        this.running        = false;
        this.startTime      = startTime;
        this.time           = startTime;
        this.endTime        = endTime;
        this.direction      = (startTime < endTime ? 1 : -1);
        this.allowOverrun   = (allowOverrun ? true : false);
    }
    
    get() {
        return {
            id           : this.id,
            allowOverrun : this.allowOverrun,
            running      : this.running,
            time         : this.time,
            startTime    : this.startTime,
            endTime      : this.endTime
        };
    }
    
    update(running, startTime, endTime, allowOverrun) {
        if (typeof running === "boolean") {
            this.running = running;
        }
        
        if (typeof startTime === "number") {
            this.time = startTime.toFixed(0) - 0;
        }
        
        if (typeof endTime === "number") {
            this.endTime = endTime.toFixed(0) - 0;
            
            if (typeof startTime === "number") {
                this.direction = (startTime < endTime ? 1 : -1);
            }
            
        }
        
        if (typeof allowOverrun === "boolean") {
            this.allowOverrun = allowOverrun;
        }       
        
        return this.get();    
    }
    
    tick() { 
        if ( this.running && ( ((this.endTime - this.time) * this.direction > 0) || this.allowOverrun ) ) {
            this.time = this.time + this.direction - 0;
            return true;
        }
        // TODO: 
        //  * Disable countdown clock that ticks to zero 
        //  * Disable count up clock that reaches max time and dows not allow overrun
        
        return false;
    }
}


class Game extends EventEmitter {
    
    clockLoopStep(self) {
        var dt = Date.now() - self.expected; // the drift (positive for overshooting)
        if (dt > self.interval) {
            // something really bad happened. Maybe the browser (tab) was inactive?
            // possibly special handling to avoid futile "catch up" run
            console.log("WARNING clockLoopStep: dt > interval")
        }
        
        // step code
        if (self.clocks.period.tick()) {
            self.emit('clockTimeUpdated', {id: 'period', field: 'time', value:self.clocks.period.time});
        }
            
        if (self.clocks.countdown.tick()) {
            self.emit('clockTimeUpdated', {id: 'countdown', field: 'time', value:self.clocks.countdown.time});
        }
        
        self.emit('clockLoopTick');

        self.expected += self.interval;
        setTimeout(function () { self.clockLoopStep(self) }, Math.max(0, self.interval - dt)); // take into account drift
    }
    
    constructor() {
        super();
        this.resetGame();
        
        // vars to compensate for clock drift
        this.interval = 1000; // ms
        this.expected = Date.now() + this.interval;
        
        SELF = this;
        
        setTimeout(function () { SELF.clockLoopStep(SELF); }, SELF.interval); 
    }
    
    get() {
        return {
            state: this.state,
            teamInfo : {
                home : this.teams.home.getInfo(),
                away : this.teams.away.getInfo()
            },
            score : {
                home : this.teams.home.score.get(),
                away : this.teams.away.score.get()
            },
            clock : {
                period    : this.clocks.period.get(),
                countdown : this.clocks.countdown.get()
            },
            periodNumber : this.periodNumber,
            lastUpdated: null
        }
    }
      
    resetGame(homeTeamName, homeTeamColour, awayTeamName, awayTeamColour, periodLengthSec, halftimeLengthSec) {
        SELF = null;
        TIMEOUT = null;
        
        this.teams = {
            home        : new Team(homeTeamName, homeTeamColour),
            away        : new Team(awayTeamName, awayTeamColour)
        }
        
        var p = 1800;
        if (typeof periodLengthSec === "number") {
            p = periodLengthSec;
        }
        
        var c = 600;
        if (typeof halftimeLengthSec === "number") {
            c = halftimeLengthSec;
        }
        
        this.clocks = {
            period      : new Clock('period', 0, p, true),
            countdown   : new Clock('countdown', c, 0, false)
        }
        
        this.state          = 'reset';
        this.periodNumber   = 1;
        this.emit('gameReset', this.get());
    }
       
    updateScore(team, type, value) {
        // TODO: Check if value has changed and update timestamp
        this.teams[team].score[type] = value;
        this.emit('scoreUpdated');
    }
    
    updatePeriodNumber(number) {
        if ((number == 1 || number == 2) && number != this.periodNumber ) {
            this.periodNumber = number;
            this.emit('periodNumberUpdated');
        }        
    }
    
    updateState(state) {
        switch (state) {
            case 'halftime' :
                this.clocks.countdown.time = this.clocks.countdown.startTime;
                this.startClock('countdown');
                this.state = 'halftime';
                break;
            case 'endgame':
                this.stopClock('period');
                this.stopClock('countdown');
                this.state = 'endgame';
                break;
        }
    }
    
    startClock(clock) {
        switch (clock) {
            case 'period':
                if (!this.clocks.period.running) {
                    this.clocks.period.running = true;
                    if (this.clocks.countdown.running) {
                        this.clocks.countdown.running = false;
                        this.emit('clockStop', {id:'countdown'});                
                    }
                    if (this.state == 'halftime') {
                        this.periodNumber = 2;
                    }
                    this.state = 'started';
                    this.emit('clockStart', {id:'period'});                   
                }
                break;
            case 'countdown':
                if (!this.clocks.countdown.running) {
                    this.clocks.countdown.running = true;
                    if (this.clocks.period.running) {
                        this.clocks.period.running = false;
                        this.state = 'paused';
                        this.emit('clockStop', {id:'period'});                
                    }
                    this.emit('clockStart', {id:'countdown'});     
                }                
                break;
        }        
    }
    
    stopClock(clock) {
        switch (clock) {
            case 'period':
                if (this.clocks.period.running) {
                    this.clocks.period.running = false;
                    this.state = 'paused';
                    this.emit('clockStop', {id:'period'});
                }
                break;
            case 'countdown':
                if (this.clocks.countdown.running) {
                    this.clocks.countdown.running = false;
                    this.emit('clockStop', {id:'countdown'});
                }                
                break;
        }           
    }
  
} // class Game 

var game = new Game();

module.exports = game;