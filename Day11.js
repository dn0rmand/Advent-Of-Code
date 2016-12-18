const prettyHrtime = require('pretty-hrtime');
const parser = require('./parser.js');
const maxSteps = 40;

const puzzleData = [
'The first floor contains a strontium generator, a strontium-compatible microchip, a plutonium generator, and a plutonium-compatible microchip.',
'The second floor contains a thulium generator, a ruthenium generator, a ruthenium-compatible microchip, a curium generator, and a curium-compatible microchip.',
'The third floor contains a thulium-compatible microchip.',
'The fourth floor contains nothing relevant.',
'The first floor contains a elerium generator, a elerium-compatible microchip, a dilithium generator, and a dilithium-compatible microchip.'
];

const puzzleExample = [
    'The first floor contains a strontium-compatible microchip, and a plutonium-compatible microchip.',
    'The second floor contains a strontium generator.',
    'The third floor contains a plutonium generator.',
    'The fourth floor contains nothing relevant.'
];

var input = {
    state: {
        elevator:1,        
        chips: {},
        generators: {}
    },
    namesmap: {},
    names: [],
    getName: function(name) {
        if (this.namesmap[name] === undefined) {
            var i = this.names.length;
            var n = 'A'.charCodeAt(0)+i;
            var n = String.fromCharCode(n);
            this.namesmap[name] = n;
            this.names.push(n);
            return n;
        }
        else
            return this.namesmap[name];
    }
};

puzzleData.forEach((line) =>
{    
    var parse = new parser(line.toLowerCase());
    parse.expectToken("the");
    var floor = parse.getToken();
    switch (floor)
    {
        case 'first':   floor = 1; break;
        case 'second':  floor = 2; break;
        case 'third':   floor = 3; break;
        case 'fourth':  floor = 4; break;
        default:
            throw "Invalid floor";
    }

    parse.expectToken("floor");
    parse.expectToken("contains");
    var t = parse.getToken();
    if (t === "nothing")
        return;
    if (t !== 'a')
        throw "Invalid data";

    while (t === 'a') 
    {
        var name = parse.getToken();
        var type;
        if (parse.peek() === '-')
        {
            parse.expectOperator('-');
            parse.expectToken("compatible");
            parse.expectToken("microchip");
            type = "chips";
        }
        else
        {
            parse.expectToken("generator");
            type = "generators";
        }

        name = input.getName(name);
        input.state[type][name] = floor;

        if (parse.peek() === '.')        
            break;

        parse.expectOperator(',');
        var t = parse.getToken();
        if (t === 'and')
            t = parse.getToken();
    }
});

var _keys = input.names;
var _keysLength = _keys.length;

// ** ** **

function cloneState(state) 
{
    var clone = {
        elevator: state.elevator,
        step: 0,
        chips: {},
        generators: {}
    };

    // Clone
    var c  = clone.chips;
    var g  = clone.generators;
    var sc = state.chips;
    var sg = state.generators;
    
    for(var i = 0 ; i < _keysLength ; i++)
    {
        var key = _keys[i];
        c[key]  = sc[key];
        g[key]  = sg[key];
    }

    return clone;
}

function makeKey(state) 
{
    if (state.$key !== undefined)
        return state.$key;

    var key = state.elevator; // Position of elevator is important

    var pairs = [];
    var couple= [];
    var chips = state.chips;
    var generators = state.generators;

    for(var i = 0 ; i < _keysLength ; i++)
    {
        var k = _keys[i];
        var c = chips[k];
        var g = generators[k];

        if (c === g)
            pairs.push('P'+c); // It's a pair, doesn't matter which one  but the floor matter
        else
            pairs.push('D'+ c + g);
    }

    pairs.sort();

    key += pairs.join('');

    state.$key = key;
    return key;
};

function isDone(state) 
{
    var chips = state.chips;
    var generators = state.generators;
    for(var i = 0 ; i < _keysLength ; i++)
    {
        var key = _keys[i];
        if (chips[key] != 4 || generators[key] != 4)
            return false;
    }

    return true;
};

function isBelowFloorsEmpty(state)
{
    var chips = state.chips;
    var generators = state.generators;
    var elevator = state.elevator;

    if (elevator == 1)
        return true;

    for(var i = 0 ; i < _keysLength ; i++)
    {
        var key = _keys[i];
        if (chips[key] < elevator || generators[key] < elevator)
            return false;
    }

    return true;    
}

function isValid(state)
{
    var chips = state.chips;
    var generators = state.generators;

    for(var i = 0 ; i < _keysLength ; i++)
    {
        var key = _keys[i];

        if (chips[key] != generators[key])
        {
            for(var j = 0 ; j < _keysLength ; j++)
            {
                if (i != j)
                {
                    var key2 = _keys[j];
                    if (chips[key] === generators[key2])
                        return false;
                }
            }
        }
    }

    return true;
}

function possibleMoves(state, direction)
{
    var self = state;
    var newLevel = state.elevator + direction;

    function DoMove(collection, name) 
    {
        var len = collection.length;

        for(var i = 0 ; i < len ; i++)
        {
            var addClone1 = false;

            var g1 = collection[i];
            var clone1 = cloneState(self);

            clone1.elevator  = newLevel;
            clone1[name][g1] = newLevel;

            if (isValid(clone1))
            {
                if (direction == 1)
                    addClone1 = true;
                else
                {
                    moves.push(clone1);
                    break;
                }
            }

            // Try to add a different generator

            for(var j = 0 ; j < len ; j++)
            {
                if (i === j)
                    continue;

                var g2 = collection[j];
                var clone2 = cloneState(clone1);
    
                clone2.elevator  = newLevel;
                clone2[name][g2] = newLevel;

                if (isValid(clone2))
                {
                    addClone1 = false;
                    moves.push(clone2);
                    break;
                }
            } 

            if (addClone1)
                moves.push(clone1);
        }
    }

    if (newLevel < 1 || newLevel > 4)
        return [];

    var moves = [];

    // Make list of chips and generators on the current floor

    var chips = [], generators = [], pairKey = undefined;

    for(var i = 0 ; i < _keysLength ; i++)
    {
        var key = _keys[i];
        if (self.chips[key] === self.elevator)
            chips.push(key);

        if (self.generators[key] === self.elevator)
        {
            generators.push(key);
            if (pairKey === undefined && self.chips[key] === self.elevator)
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
        var clone = cloneState(self);

        clone.elevator      = newLevel;
        clone.chips[k]      = newLevel;
        clone.generators[k] = newLevel;

        if (isValid(clone))
            moves.push(clone);
    }

    return moves;
}

var _moves = {};

function moveExist(move) 
{
    var key = makeKey(move);
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

function Execute(current)
{
    var items = [0, 0, 0, 0];

    for(var i = 0; i < _keysLength; i++)
    {
        var k = _keys[i];
        var f1 = current.chips[k]-1;
        var f2 = current.generators[k]-1;
        items[f1]++;
        items[f2]++;
    }

    var m = 0;

    for (var i = 0; i < items.length-1; i++)
    {
        var it = items[i];
        m += (2*(it-1) -1);
        items[i+1] += it;
    }
    
    return m;
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
            nextMoves = nextMoves.concat(possibleMoves(move, +1));
            if (! isBelowFloorsEmpty(move))
                nextMoves = nextMoves.concat(possibleMoves(move, -1));
        }

        moves = [];

        for(var i = 0; i < nextMoves.length; i++)
        {
            var move = nextMoves[i];
            if (isDone(move))
            {
                return step;
            }
            move.steps = step;
            if (! moveExist(move))
            {
                moves.push(move);
            }
        }
        
        // console.log("Step " + step + " has " + moves.length + " possibilites");
    }
    console.log("No solution, Really!");
    return -1;
}

var start = process.hrtime();

var bestSolution = Execute(input.state, 0);

var end = process.hrtime(start);

words = prettyHrtime(end, {verbose:true});
console.log(words); // '1 millisecond 209 microseconds'

if (bestSolution > 0)
    console.log("Resolved in " + bestSolution + " steps");
process.exit(0);


 
// do stuff 
  
