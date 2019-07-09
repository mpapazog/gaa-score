// Game.js

class VariableClass {
    constructor(value) {
        this.value = (typeof value !== "undefined" ? value : null);
    }
}

class TeamClass {
    constructor(name, colour) {
        this.name   = new VariableClass(name);
        this.colour = new VariableClass(colour);
        this.goals  = new VariableClass(0);
        this.points = new VariableClass(0);
    }
}

class ClockClass {
    constructor() {
        this.time = new VariableClass(0);
        this.maxTime = new VariableClass(1800);
    }
}

class GameClass {
    constructor() {
        this.resetGame();
    }
    
    getState() {
        return {
            teams : {
                home : {
                    name   : this.homeTeam.name.value,
                    colour : this.homeTeam.colour.value,
                    goals  : this.homeTeam.goals.value,
                    points : this.homeTeam.points.value
                },
                away : {
                    name   : this.awayTeam.name.value,
                    colour : this.awayTeam.colour.value,
                    goals  : this.awayTeam.goals.value,
                    points : this.awayTeam.points.value
                },
            },
            clocks : {
                period : this.periodClock.time.value   
            }         
        }
    }
      
    resetGame(homeTeamName, homeTeamColour, awayTeamName, awayTeamColour) {
        this.homeTeam       = new TeamClass(homeTeamName, homeTeamColour);
        this.awayTeam       = new TeamClass(awayTeamName, awayTeamColour);
        this.periodClock    = new ClockClass();
        this.clockInterval  = null;
        this.state          = "reset";
        return this.getState();
    }
    
    updateGame(homeTeamName, homeTeamColour, awayTeamName, awayTeamColour) {
        var retVal = null;
        
        if (homeTeamName != null) {
            this.homeTeam.name.value    = homeTeamName;
        }
        if (homeTeamColour != null) {
            this.homeTeam.colour.value  = homeTeamColour;
        }
        if (awayTeamName != null) {
            this.awayTeam.name.value    = awayTeamName;
        }
        if (awayTeamColour != null) {
            this.awayTeam.colour.value  = awayTeamColour;
        }
    }
        
    resetPeriodClock(startValueSec, maxValueSec) {
        if (this.clockInterval != null) {
            clearInterval(this.clockInterval);
        }
        
        if(typeof maxValueSec === "number") {
            this.periodClock.maxTime.value = maxValueSec.toFixed(0) - 0;
        }
        
        if(typeof startValueSec === "number") {
            this.periodClock.time.value = startValueSec.toFixed(0) - 0;
        } else {
            this.periodClock.time.value = 0;            
        }        
        
        return { clock : {period : this.periodClock.time.value} };        
    }
     
    updatePeriodClock(currentValueSec, running) {        
        if (this.clockInterval != null) {
            clearInterval(this.clockInterval);
        }
      
        this.clockInterval = setInterval( (function(self){
            return function () {
                self.periodClock.time.value = self.periodClock.time.value + 1;
            }
        })(this), 1000);
        
        return { clock : { period: this.periodClock.time.value } };
    }
  
    stopPeriodClock() {
        if (this.clockInterval != null) {
            clearInterval(this.clockInterval);
        }
        return this.periodClock.time.value;
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
            retVal["teams"]["home"] = {
                "goals" : this.homeTeam.goals.value,
                "points": this.homeTeam.points.value
            };
        }
        
        if (flagReturnAway) {
            retVal["teams"]["away"] = {
                "goals" : this.awayTeam.goals.value,
                "points": this.awayTeam.points.value
            };
        }
        
        return retVal;
    } // getScore
    
    updateScore(team, scoreType, changeMethod, amount) {
        if(typeof amount === "number") {
            if(typeof team === "string") {
                switch (team.toLowerCase()) {
                    case "home":
                                    var teamPtr = this.homeTeam;
                                    break;
                    case "away":
                                    var teamPtr = this.awayTeam;
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
                                    var scorePtr = teamPtr.goals;
                                    break;
                    case "points":
                                    var scorePtr = teamPtr.points;
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
                retVal["teams"][team] = {
                    goals  : teamPtr.goals.value,
                    points : teamPtr.points.value                            
                }
                
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