// Game.js

class VariableClass {
    constructor(value) {
        this.value = (typeof value !== "undefined" ? value : null);
    }
}

class ScoreClass {
    constructor() {
        this.goals  = new VariableClass(0);
        this.points = new VariableClass(0);
    }
    
    get() {
        return {
            goals   : this.goals.value,
            points  : this.points.value           
        };
    }
}

class TeamClass {
    constructor(name, colour) {
        this.name   = new VariableClass(name);
        this.colour = new VariableClass(colour);
        this.score  = new ScoreClass();
    } 
    
    get() {
        return {
            name    : this.name.value,
            colour  : this.colour.value,
            score   : this.score.get()
        };
    }
}

class ClockClass {
    constructor(startTime, endTime, allowOverrun) {
        this.running        = false;
        this.time           = startTime;
        this.endTime        = endTime;
        this.direction      = (startTime < endTime ? 1 : -1);
        this.allowOverrun   = ( allowOverrun ? true : false );
    }
    
    get() {
        return {
            allowOverrun : this.allowOverrun,
            running      : this.running,
            time         : this.time,
            endTime      : this.endTime
        };
    }
    
    update(running, startTime, endTime, allowOverrun) {
        if (typeof running === "boolean") {
            this.running = running;
        }
        
        if (typeof startTime === "number") {
            this.startTime = startTime.toFixed(0) - 0;
        }
        
        if (typeof endTime === "number") {
            this.endTime = endTime.toFixed(0) - 0;
            
            if (typeof startTime === "number") {
                this.direction = (startTime < endTime ? 1 : -1);
            }
        }
        
        if (typeof allowOverrun === "boolean") {
            this.allowOverrun = allowOverrun
        }       
        
        return this.get();    
    }
    
    tick() { 
        if ( this.running && ((this.endTime - this.time) * this.direction > 0) ) {
            this.time = this.time + this.direction - 0;
        }
        
        return this.time;
    }
}

class ClockSchedulerClass {
    constructor(ref) {
        console.log("building scheduler");
        console.log(ref.get());
    }
}

class GameClass {
    constructor() {
        this.resetGame();
        this.clockScheduler = new ClockSchedulerClass(this);
    }
    
    get() {
        return {
            teams : {
                home : this.teams.home.get(),
                away : this.teams.away.get()
            },
            clocks : {
                period    : this.clocks.period.get(),
                countdown : this.clocks.countdown.get()
            },
            state: this.state
        }
    }
      
    resetGame(homeTeamName, homeTeamColour, awayTeamName, awayTeamColour) {
        this.teams = {
            home        : new TeamClass(homeTeamName, homeTeamColour),
            away        : new TeamClass(awayTeamName, awayTeamColour)
        }
        
        this.clocks = {
            period      : new ClockClass(),
            countdown   : new ClockClass()
        }
        
        this.clockInterval  = null;
        this.state          = "reset";
        return this.get();
    }
    
    updateGame(homeTeamName, homeTeamColour, awayTeamName, awayTeamColour) {
        var retVal = null;
        
        if (homeTeamName != null) {
            this.teams.home.name.value    = homeTeamName;
        }
        if (homeTeamColour != null) {
            this.teams.home.colour.value  = homeTeamColour;
        }
        if (awayTeamName != null) {
            this.teams.away.name.value    = awayTeamName;
        }
        if (awayTeamColour != null) {
            this.teams.away.colour.value  = awayTeamColour;
        }
    }
        
    resetPeriodClock(startValueSec, maxValueSec) {
        
        this.updatePeriodClock(startValueSec, maxValueSec, false);
        
        if(typeof startValueSec !== "number") {
            this.periodClock.time.value = 0;            
        }        
        
        return { clocks : {period : this.periodClock.time.value} };        
    }
     
    updatePeriodClock(startValueSec, maxValueSec, running) {        
        if (running !== null) {
            if (this.clockInterval !== null) {
                clearInterval(this.clockInterval);
            }
            
            if (running) {
                this.clockInterval = setInterval( (function(self){
                    return function () {
                        self.periodClock.time.value = self.periodClock.time.value + 1;
                    }
                })(this), 1000);                
            }            
        }
        
        if(typeof maxValueSec === "number") {
            this.periodClock.maxTime.value = maxValueSec.toFixed(0) - 0;
        }
        
        if(typeof startValueSec === "number") {
            this.periodClock.time.value = startValueSec.toFixed(0) - 0;
        } 
        
        return { clocks : { period: this.periodClock.time.value } };
    }
    
    getScore(team) {
        var flagReturnHome = true,
            flagReturnAway = true,
            retVal = { teams:{} };
        
        if(typeof team === "string") {
            switch (team.toLowerCase()) {
                case "home":
                                flagReturnAway = false;
                                break;
                case "away":
                                flagReturnHome = false;
                                break;
                default:
                                return null;
            } // switch
        } // if typeof
        
        if (flagReturnHome) {
            retVal["teams"]["home"] = { score: this.teams.home.score.get() };
        }
        
        if (flagReturnAway) {
            retVal["teams"]["away"] = { score: this.teams.away.score.get() };
        }
        
        return retVal;
    } // getScore
    
    updateScore(team, scoreType, changeMethod, amount) {
        if(typeof amount === "number") {
            if(typeof team === "string") {
                switch (team.toLowerCase()) {
                    case "home":
                                    var teamPtr = this.teams.home;
                                    break;
                    case "away":
                                    var teamPtr = this.teams.away;
                                    break;
                    default:
                                    return null;
                } // switch
            } // if typeof
            else {
                return null;
            }
            
            if(typeof scoreType === "string") {
                switch (scoreType.toLowerCase()) {
                    case "goals":
                                    var scorePtr = teamPtr.score.goals;
                                    break;
                    case "points":
                                    var scorePtr = teamPtr.score.points;
                                    break;
                    default:
                                    return null;
                } // switch
            } // if typeof
            else {
                return null;
            }
            
            if(typeof changeMethod === "string") {
                switch (changeMethod.toLowerCase()) {
                    case "adjust":
                                    var newValue = (scorePtr.value - 0) + (amount.toFixed(0) - 0);
                                    break;
                    case "set":
                                    var newValue = amount.toFixed(0) - 0;
                                    break;
                    default:
                                    return null;
                } // switch
                
                if (newValue >= 0) {
                    scorePtr.value = newValue - 0;
                }
                
                var retVal = { teams:{} };
                retVal["teams"][team] = { score: teamPtr.score.get() };
                
                return retVal;
                
            } // if typeof
            else {
                return null;
            }
        } // if typeof
        else {
            return null;
        }
        
    }
  
} // class GameClass 

var Game = new GameClass();

module.exports = Game;