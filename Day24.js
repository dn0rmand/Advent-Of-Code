module.exports = function()
{
    const fs = require('fs');
    const readline = require('readline');
    const assert = require('assert');

    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day24.data')
    });

    var _visited;

    var _width;
    var _map        = [];
    var _segments   = {};
    var _maxTarget  = 0;
    var _locations  = [];
    var _allPaths   = [];

    readInput
    .on('line', (line) => { 
        if (_width === undefined)
            _width = line.length;
        else
            assert(_width === line.length);

        _map.push(line);
        for(var i = 0; i < _width; i++)
        {
            var t = line[i];
            if (t >= '0' && t <= '9')
            {
                t = +t;
                if (t > _maxTarget)
                    _maxTarget = line[i];

                _locations[t] = { x:i, y:_map.length-1 }
            }
        }
    })
    .on('close', () => {
       _allPaths = getAllPath();
       _segments = getSegments();
       var distance = getShortest();
       console.log("Shortest path is " + distance + " steps long");
        process.exit(0);
    });

    function getAllPath()
    {
        function getNextTargets(path)
        {
            var targets = [];
            for(var i = 1; i <= _maxTarget; i++)
            {
                var c = ''+i;
                if (path.indexOf(c) <= 0)
                    targets.push(i);
            }

            return targets;
        }

        var paths = ['0'];

        while (true)
        {
            var newPaths = [];

            for(var i = 0; i < paths.length; i++)
            {
                var ts = getNextTargets(paths[i]);
                ts.forEach(function(t) {
                    newPaths.push(paths[i] + t);
                });
            }

            if (newPaths.length == 0)
                break;
            else
                paths = newPaths;
        }
        return paths;
    }

    function getShortest()
    {
        var shortest = -1;

        for(var i = 0; i < _allPaths.length; i++)
        {
            var distance = 0;
            var path = _allPaths[i].split('');
            for(var j = 0; j < path.length-1; j++)
            {
                var segment = path[j]+'-'+path[j+1];
                distance += _segments[segment];
            }
            distance += _segments[ '0-' + path[path.length-1]];
            if (shortest < 0 || distance < shortest)
                shortest = distance;
        }        

        return shortest;
    }    

    function getSegments()
    {
        var paths = {};

        for(var i = 0; i <= _maxTarget; i++)
        {
            for(var j = 0; j <= _maxTarget; j++) 
            {
                if (i == j)
                    continue;

                var from, to;
                if (i < j)
                {
                    from = i;
                    to   = j;
                }
                else
                {
                    from = j;
                    to   = i;
                }

                var p1 = from + '-' + to;
                var p2 = to + '-' + from;

                if (paths[p1] === undefined)
                {
                    paths[p1] = getDistance(from, to);
                    if (from != 0)
                        paths[p2] = paths[p1];
                }
            }
        }

        return paths;
    }

    function initialize()
    {
        if (_visited === undefined)
            _visited = new Uint8Array(_map.length * _width);

        _visited.fill(0);
    }

    function isVisited(l)
    {
        if (_map[l.y][l.x] === '#') // Wall
            return true;

        var p = l.x + (_width * l.y);
        if (_visited[p] === 1)
            return true;

        return false;
    }

    function setVisited(l)
    {
        var p = l.x + (_width * l.y);
        _visited[p] = 1;
    }

    function getDistance(from, to)
    {
        initialize();

        to   = _locations[to];
        from = _locations[from];

        setVisited(from);

        function search(locations, step)
        {
            while (locations.length > 0)
            {
                for(var i = 0; i < locations.length; i++)
                {
                    var l = locations[i];
                    if (l.x === to.x && l.y === to.y)
                        return step;
                }

                step++;

                var newLocations = [];

                for(var i = 0; i < locations.length; i++)
                {
                    var l = locations[i];

                    var l1 = { x: l.x - 1, y: l.y};
                    var l2 = { x: l.x + 1, y: l.y};
                    var l3 = { x: l.x , y: l.y - 1};
                    var l4 = { x: l.x , y: l.y + 1};

                    if (! isVisited(l1))
                    {
                        setVisited(l1);
                        newLocations.push(l1);
                    }
                    if (! isVisited(l2))
                    {
                        setVisited(l2);
                        newLocations.push(l2);
                    }
                    if (! isVisited(l3))
                    {
                        setVisited(l3);
                        newLocations.push(l3);
                    }
                    if (! isVisited(l4))
                    {
                        setVisited(l4);
                        newLocations.push(l4);
                    }
                }

                locations = newLocations;
                newLocations = [];
            }
        }

        var distance = search([ from ], 0);

        return distance;
    }
}