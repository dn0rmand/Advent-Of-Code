const fs = require('fs');
const readline = require('readline');

const readInput = readline.createInterface({
  input: fs.createReadStream('2015/Data/Day3.data')
});

//var presents = [];

var santa = {x:0, y:0};
var robot = {x:0, y:0};
var visited  = {};
var houseCount = 0;
var turn = true;

// Initialize with current position
addVisited(santa);
addVisited(robot);

readInput
.on('line', (line) => { parseMoves(line); })
.on('close', () => {
    console.log(houseCount + " houses visited");
    process.exit(0);
});

function addVisited(pos)
{
    var key = "X"+pos.x+"_Y"+pos.y;    
    var count = visited[key] || 0;
    if (count == 0)
        houseCount++;
    visited[key] = count+1;
}

function parseMoves(line)
{
    for(var i = 0; i < line.length; i++)
    {        
        var position = turn ? santa : robot;
        switch (line[i])
        {
            case '^':
                position.y++;
                addVisited(position);
                break;
            case 'v':
                position.y--;
                addVisited(position);
                break;
            case '<':
                position.x--;
                addVisited(position);
                break;
            case '>':
                position.x++;
                addVisited(position);
                break;
        }
        
        turn = ! turn;
    }
}