const crypto = require('crypto');
const key = 'bwnlcvfs';

function getHashPath(path)
{
    var hash = crypto.createHash('md5').update(key + path).digest("hex");

    return hash;
}

function isOpen(c)
{
    return c >= 'b' && c <= 'f';
}

function executeShortest()
{
    var moves = [ { x:0, y:0, path:'' }];

    while (true) 
    {
        var shortest = null;
        for(var i = 0; i < moves.length; i++)
        {
            var move = moves[i];
            if (move.x == 3 && move.y == 3)
            {
                return move.path;
            }
        }

        var next = [];

        for(var i = 0; i < moves.length; i++)
        {
            var move = moves[i];
            var hash = getHashPath(move.path);
            if (isOpen(hash[0])) // up
            {
                var p = {
                    path: move.path+'U',
                    x: move.x,
                    y: move.y-1,
                }
                if (p.y >= 0)
                    next.push(p);
            }
            if (isOpen(hash[1])) // down
            {
                var p = {
                    path: move.path+'D',
                    x: move.x,
                    y: move.y+1
                }
                if (p.y < 4)
                    next.push(p);
            }
            if (isOpen(hash[2])) // left
            {
                var p = {
                    path: move.path+'L',
                    x: move.x-1,
                    y: move.y
                }
                if (p.x >= 0)
                    next.push(p);
            }
            if (isOpen(hash[3])) // right
            {
                var p = {
                    path: move.path+'R',
                    x: move.x+1,
                    y: move.y
                }
                if (p.x < 4)
                    next.push(p);
            }
        }

        moves = next;
    }
}

var longest = null;

function setLongest(path)
{
    if (longest == null)
        longest = path;
    else if (path.length > longest.length)
        longest = path;
}

function executeLongest()
{
    var moves = [ { x:0, y:0, path:'' }];

    while (moves.length > 0) 
    {
        var next = [];

        for(var i = 0; i < moves.length; i++)
        {
            var move = moves[i];
            var hash = getHashPath(move.path);
            if (isOpen(hash[0])) // up
            {
                var p = {
                    path: move.path+'U',
                    x: move.x,
                    y: move.y-1,
                }
                if (p.y >= 0)
                {
                    if (p.y == 3 && p.x == 3)
                        setLongest(p.path);
                    else
                        next.push(p);
                }
            }
            if (isOpen(hash[1])) // down
            {
                var p = {
                    path: move.path+'D',
                    x: move.x,
                    y: move.y+1
                }
                if (p.y < 4)
                {
                    if (p.y == 3 && p.x == 3)
                        setLongest(p.path);
                    else
                        next.push(p);
                }
            }
            if (isOpen(hash[2])) // left
            {
                var p = {
                    path: move.path+'L',
                    x: move.x-1,
                    y: move.y
                }
                if (p.x >= 0)
                {
                    if (p.y == 3 && p.x == 3)
                        setLongest(p.path);
                    else
                        next.push(p);
                }
            }
            if (isOpen(hash[3])) // right
            {
                var p = {
                    path: move.path+'R',
                    x: move.x+1,
                    y: move.y
                }
                if (p.x < 4)
                {
                    if (p.y == 3 && p.x == 3)
                        setLongest(p.path);
                    else
                        next.push(p);
                }                    
            }
        }

        moves = next;
    }
    return longest.length;
}

var path = executeShortest();
console.log("Shortest path is: " + path);

var l = executeLongest();
console.log("Longest path is: " + l + " characters long");

process.exit(0);