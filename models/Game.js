// Game.js

class ScoreClass {
    constructor() {
        this.value = 0;
    }
}

class TeamClass {
    constructor() {
        this.goals  = new ScoreClass();
        this.points = new ScoreClass();
    }
}

class ClockClass {
    constructor(name) {
        this.timeInt = 0;
        this.timeStr = "0:00"
        this.maxTime = 1800;
    }
}

class GameClass {
    constructor() {
        this.resetGame();
    }
      
    resetGame() {
        this.homeTeam       = new TeamClass();
        this.awayTeam       = new TeamClass();
        this.periodClock    = new ClockClass();
        this.clockInterval  = null;
        this.state          = "reset";
        return this.getState();
    }
    
    getState() {
        return {
            teams : {
                home : {
                    goals  : this.homeTeam.goals.value,
                    points : this.homeTeam.points.value
                },
                away : {
                    goals  : this.awayTeam.goals.value,
                    points : this.awayTeam.points.value
                },
            },
            clocks : {
                period : this.periodClock.timeStr    
            }         
        }
    }
    
    fancyTimeFormat(time)
    {   
        if (time>5998) {
            return "99:59"; // prevent 3-digit minute numbers. With 100+ minute intermission clock values, jam clock will appear stuck at 99:59, but that is better than text overflow
        }

        // Minutes and seconds
        var mins = ~~(time / 60);
        var secs = ~~time % 60;
        var ret = "";
        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    }
    
    resetPeriodClock(maxSeconds) {
        if (this.clockInterval != null) {
            clearInterval
        }
        console.log("Reset clock");
        if(typeof seconds === "number") {
            this.periodClock.maxTime = seconds.toFixed(0) - 0;
        }
        
        this.periodClock.timeInt = 0;
        this.periodClock.timeStr = "0:00";
        
        return { clock : {period:this.periodClock.timeStr} };        
    }
      
    startPeriodClock() {
        if (this.clockInterval != null) {
            clearInterval(this.clockInterval);
        }
        console.log("Start clock");
      
        this.clockInterval = setInterval( (function(self){
            return function () {
                self.periodClock.timeInt = self.periodClock.timeInt + 1;
                self.periodClock.timeStr = self.fancyTimeFormat(self.periodClock.timeInt);
            }
        })(this), 1000);
        
        return { clock : {period:this.periodClock.timeStr} };
    }
  
    stopPeriodClock() {
        if (this.clockInterval != null) {
            clearInterval(this.clockInterval);
        }
        return this.periodClock.timeStr;
    }
    
    getScore(team) {
        var flagReturnHome = true,
            flagReturnAway = true,
            retVal = {};
        
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
            retVal["home"] = {
                "goals" : this.homeTeam.goals.value,
                "points": this.homeTeam.points.value
            };
        }
        
        if (flagReturnAway) {
            retVal["away"] = {
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
            
            if(typeof changeMethod === "string") {
                switch (changeMethod.toLowerCase()) {
                    case "adjust":
                                    var newValue = (scorePtr.value - 0) + (amount.toFixed(0) - 0);
                                    if (newValue >= 0) {
                                        scorePtr.value = newValue - 0;
                                    }
                                    return {goals:teamPtr.goals.value, points:teamPtr.points.value};
                                    break;
                    case "set":
                                    var newValue = amount.toFixed(0) - 0;
                                    if (newValue >= 0) {
                                        scorePtr.value = newValue - 0;
                                    }
                                    return {goals:teamPtr.goals.value, points:teamPtr.points.value};
                                    break;
                    default:
                                    return null;
                } // switch
            } // if typeof
        } // if typeof
        else {
            return null;
        }
        
    }
  
} // class GameClass 

var Game = new GameClass();

module.exports = Game;