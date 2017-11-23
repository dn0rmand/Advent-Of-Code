module.exports = function()
{
    const assert    = require('assert');
    const fs        = require('fs');
    const readline  = require('readline');
    const parser    = require('./parser.js');

    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day22.data')
    });

    var $nodes = [];
    var $nodeCount = 0;
    var $maxX = 0 , $maxY = 0;

    readInput
    .on('line', (line) => { 
        parseLine(line.toLowerCase());
    })
    .on('close', () => {
        console.log("Data loaded, " + $nodeCount + " nodes");
        var matchingPairs = findMatchingPairs($nodes);
        console.log(matchingPairs + " matching pairs"); 

        var empty = findEmptyNodes($nodes);
        console.log(empty.length + " empty nodes");
        assert(empty.length == 1);
        var empty = empty[0];

        var steps = findShortestPath([ empty ]);
        var steps2 = 1 + (($maxX-1) * 5);

        steps += steps2;

        console.log("Part2 resolved in " + steps + " steps");
        process.exit(0);
    });

    function findMatchingPairs(state)
    {
        var matchingPairs = 0;

        for(var y = 0; y <= $maxY; y++)
        for (var x = 0; x <= $maxX; x++)
        {
            var n1 = state[y][x];
            if (n1.used == 0)
                continue;

            for(var y2 = 0; y2 <= $maxY; y2++)
            for (var x2 = 0; x2 <= $maxX; x2++)
            {
                if (x == x2 && y == y2)
                    continue;

                var n2 = state[y2][x2];
                if ((n2.size-n2.used) >= n1.used)
                    matchingPairs++;
            }
        }

        return matchingPairs;
    }

    function findShortestPath(nodes)
    {        
        function getConnectedNodes(moves, x, y)
        {
            var size = $nodes[y][x].size;

            if (y > 0 && $nodes[y-1][x].used <= size) 
            {
                moves.push({ x:x, y:y-1 });
            }

            if (x < $maxX && $nodes[y][x+1].used <= size) 
            {
                moves.push({ x:x+1, y:y });
            }

            if (x > 0 && $nodes[y][x-1].used <= size) 
            {
                moves.push({ x:x-1, y:y });
            }

            if (y < $maxY && $nodes[y+1][x].used <= size) 
            {
                moves.push({ x:x, y:y+1 });
            }            
        }

        var step = -1;

        while (nodes.length > 0)
        {
            step++;

            console.log("Step " + step + " - " + nodes.length + " nodes");
            for (var i = 0; i < nodes.length; i++)
            {
                var node = nodes[i];
                if ((node.x == $maxX-1 && node.y == 0) || (node.x == $maxX && node.y == 1))
                    return step;                
            }

            var moves = [];
            var prevNode = null;
            for(var i = 0; i < nodes.length; i++)
            {
                var node = nodes[i];
                if (prevNode != null)
                {
                    if (prevNode.x == node.x && prevNode.y == node.y)
                        continue; // Skip duplicates
                }
                prevNode = node;
                getConnectedNodes(moves, node.x, node.y);
            }

            moves.sort(function (v1, v2) {
                var s = v1.x - v2.x;
                if (s === 0)
                    s = v1.y - v2.y;
                return s;
            });

            nodes = moves;
        }   
    }

    function findEmptyNodes(state)
    {
        var empty = [];

        for(var y = 0; y <= $maxY; y++)
        for(var x = 0; x <= $maxX; x++)
        {
            if (state[y][x].used === 0)
            {
                empty.push({x:x, y:y});
            }
        }
        return empty;
    }

    function parseLine(line, decrypt)
    {
        var parse = new parser(line);

        var token = parse.getToken();
        if (token != "")
            return;
        parse.expectOperator('/');
        parse.expectToken('dev')
        parse.expectOperator('/');
        parse.expectToken('grid')
        parse.expectOperator('/');
        parse.expectToken('node')
        parse.expectOperator('-');
        parse.expectToken('x')
        var x = parse.getNumber();
        parse.expectOperator('-');
        parse.expectToken('y')
        var y = parse.getNumber();
        var size = parse.getNumber();
        parse.expectToken('t');
        var used = parse.getNumber();
        parse.expectToken('t'); 
        var avail = parse.getNumber();
        parse.expectToken('t')
        var percent = parse.getNumber();
        parse.expectOperator('%');

        assert(avail + used == size);

        var p = Math.floor((used / size) * 100);
        assert(p == percent);

        $maxX = Math.max(x, $maxX);
        $maxY = Math.max(y, $maxY);

        node = {
            used: used,
            size: size,
        };      
        var row = $nodes[y];
        if (row === undefined)
            row = $nodes[y] = [];
        row[x] = node;
        $nodeCount++;
    }
}
