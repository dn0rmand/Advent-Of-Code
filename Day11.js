const consoleControl = require("console-control-strings");
const prettyHrtime = require('pretty-hrtime');
const maxSteps = 40;

const DN_input = {
    elevator: 1,
    chips: {
        A: 1,
        B: 1,
        C: 2,
        D: 2,
        E: 3,
        F: 1,
        G: 1
    },
    generators: {
        A: 1,
        B: 1,
        C: 2,
        D: 2,
        E: 2,
        F: 1,
        G: 1
    }
}

const Example_input = {
    elevator: 1,
    chips: {
        A: 1,
        B: 1
    },
    generators: {
        A:2,
        B:3,
    }
};

var input = DN_input;
var _keys  = [];

Object.keys(input.chips).forEach((chip) => {
    _keys.push(chip);
});

_keys.sort();

// ** ** **

function stateObject(state) 
{
    this.elevator = state.elevator;
    this.step  = 0;
    this.chips = {};
    this.generators = {};
    this.$key = undefined;

    // Clone

    for(var i = 0 ; i < _keys.length ; i++)
    {
        var key = _keys[i];
        this.chips[key]      = state.chips[key];
        this.generators[key] = state.generators[key];
    }

    this.makeKey = function() 
    {
        if (this.$key !== undefined)
            return this.$key;

        var key = this.elevator; // Position of elevator is important

        var pairs = [];

        for(var i = 0 ; i < _keys.length ; i++)
        {
            var k = _keys[i];
            var c = this.chips[k];
            var g = this.generators[k];

            if (c == g)
                pairs.push('P'+c); // It's a pair, doesn't matter which one  but the floor matter
            else
                pairs.push('D'+ c + g);
        }

        pairs.sort();
        key += pairs.join('');
        // for (var i = 0; i < pairs.length; i++)
        //     key += 'P'+pairs[i];
        this.$key = key;
        return key;
    };

    this.isDone = function() 
    {
        for(var i = 0 ; i < _keys.length ; i++)
        {
            var key = _keys[i];
            if (this.chips[key] != 4 || this.generators[key] != 4)
                return false;
        }

        return true;
    };

    this.isValid = function()
    {
        for(var i = 0 ; i < _keys.length ; i++)
        {
            var key = _keys[i];

            if (this.chips[key] != this.generators[key])
            {
                for(var j = 0 ; j < _keys.length ; j++)
                {
                    if (i != j)
                    {
                        var key2 = _keys[j];
                        if (this.chips[key] == this.generators[key2])
                            return false;
                    }
                }
            }
        }

        return true;
    }

    this.possibleMoves = function(direction)
    {
        function DoMove(collection, name) 
        {
            for(var i = 0 ; i < collection.length ; i++)
            {
                var g1 = collection[i];
                var clone1 = new stateObject(self);

                clone1.elevator  = self.elevator + direction;
                clone1[name][g1] = self.elevator + direction;

                if (clone1.isValid())
                    moves.push(clone1);

                // Try to add a different generator

                for(var j = 0 ; j < collection.length ; j++)
                {
                    if (i == j)
                        continue;

                    var g2 = collection[j];
                    var clone2 = new stateObject(clone1);
        
                    clone2.elevator  = self.elevator + direction;
                    clone2[name][g2] = self.elevator + direction;

                    if (clone2.isValid())
                        moves.push(clone2);                    
                } 
            }
        }

        var self = this;

        if (self.elevator + direction < 1 || self.elevator + direction > 4)
            return [];

        var moves = [];

        // Make list of chips and generators on the current floor

        var chips = [], generators = [], pairKey = null;

        for(var i = 0 ; i < _keys.length ; i++)
        {
            var key = _keys[i];
            if (self.chips[key] == self.elevator)
                chips.push(key);

            if (self.generators[key] == self.elevator)
            {
                generators.push(key);
                if (pairKey == null && self.chips[key] == self.elevator)
                    pairKey = key;
            }
        }

        // Only move 1 or 2 generators
        
        DoMove(generators, "generators");

        // Only move 1 or 2 chips
        
        DoMove(chips, "chips");

        // move first pair 

        if (pairKey != null)
        {
            var k = pairKey;
            var clone = new stateObject(self);

            clone.elevator      = self.elevator + direction;
            clone.chips[k]      = self.elevator + direction;
            clone.generators[k] = self.elevator + direction;

            if (clone.isValid())
                moves.push(clone); 
        }

        return moves;
    }

};

var _moves = {};
var tests  = 0;
var bestSolution = -1;

function moveExist(move) 
{
    var key = move.makeKey();
    var old = _moves[key];
    if (old === undefined)
    {
        _moves[key] = move;
        return false;
    }

    if (old.steps <= move.steps)
        return true;

    old.steps = move.steps;
}

function Execute(current, step)
{
    if (bestSolution > 0 && step >= bestSolution)
        return; // No Point continuing

    if (current.isDone())
    {
        if (bestSolution < 0 || bestSolution > step)
            bestSolution = step;
        console.log("Solved in " + step + " steps");
        return;
    }

    if (step > maxSteps)
        return;

    current.steps = step;

    if (moveExist(current))
        return;
    
    ++tests;

    //if ((tests % 1000) == 0)
    //   process.stdout.write(tests + " tries\r");

    var moves    = current.possibleMoves(+1);
    var moves    = moves.concat(current.possibleMoves(-1));

    moves.forEach(function(move) {
        Execute(move, step+1);
    });
}

function Execute2(current)
{
    var step  = 0;
    var moves = [current];

    while(moves.length > 0)
    {
        step++;

        var nextMoves = [];
        
        for(var i = 0 ; i < moves.length ; i++)
        {
            var move = moves[i];
            nextMoves = nextMoves.concat(move.possibleMoves(+1));
            nextMoves = nextMoves.concat(move.possibleMoves(-1));
        }

        moves = [];

        for(var i = 0; i < nextMoves.length; i++)
        {
            var move = nextMoves[i];
            if (move.isDone())
            {
                return step;
            }
            move.steps = step;
            if (! moveExist(move))
            {
                moves.push(move);
            }
        }
        
        console.log("Step " + step + " has " + moves.length + " possibilites");
    }
    console.log("No solution, Really!");
    return -1;
}

var start = process.hrtime();

bestSolution = Execute2(new stateObject(input), 0);
//if (bestSolution < 0)
//    Execute(new stateObject(input), 0);

var end = process.hrtime(start);

words = prettyHrtime(end, {verbose:true});
console.log(words); // '1 millisecond 209 microseconds'

if (bestSolution > 0)
    console.log("Resolved in " + bestSolution + " steps")
console.log("Calculated " + tests + " moves");
process.exit(0);


 
// do stuff 
  
