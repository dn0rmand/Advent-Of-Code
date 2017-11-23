module.exports = function()
{
    /*
    Find x*x + 3*x + 2*x*y + y + y*y.
    Add the office designer's favorite number (your puzzle input).
    Find the binary representation of that sum; count the number of bits that are 1.
    If the number of bits that are 1 is even, it's an open space.
    If the number of bits that are 1 is odd, it's a wall.
    */

    const designerKey = 1358;
    const destination = { x: 31, y: 39} ;

    function verify(number)
    {  
        var bits = 0;
        var b = number.toString(2);

        for(var i = 0; i < b.length ; i++)
            if (b[i] == '1')
                bits++;

        return bits;
    }

    function isWall(x, y)
    {
        if (x < 0 || y < 0)
            return true; // Can't go out of building

        var number = designerKey + (x*x) + (3*x) + (2*x*y) + y + (y*y);
        var wall = false;

        while (number)
        {
            if (number & 1)
                wall = !wall;

            number = number >> 1;
        }

        return wall;
    }

    var _visited = {};

    function visited(pos, step)
    {
        var key = "X"+pos.x+"Y"+pos.y;
        var p = _visited[key];
        if (p !== undefined)
        {
            if (p < step)
                return true;
            
            _visited[key] = step;
            return false;
        }
        else
        {
            _visited[key] = step;
            return false;
        }
    }

    function execute(moves, step)
    {
        while(moves.length > 0)
        {
            if (step == 51)
                console.log(Object.keys(_visited).length + " location visited with at most 50 steps");

            // console.log(moves.length + " positions at step " + step);

            var nextMoves = [];
            for (var i = 0; i < moves.length; i++)
            {
                var pos = moves[i];
                if (pos.x == destination.x && pos.y == destination.y)
                    return step;
                if (visited(pos, step))
                    continue; // dead end!

                // Get moves from this position
                var pos1 = {x : pos.x + 1, y: pos.y     }; 
                var pos2 = {x : pos.x - 1, y: pos.y     };                
                var pos3 = {x : pos.x    , y: pos.y + 1 };                
                var pos4 = {x : pos.x    , y: pos.y - 1 };                

                if (! isWall(pos1.x, pos1.y))               
                    nextMoves.push(pos1);

                if (! isWall(pos2.x, pos2.y))               
                    nextMoves.push(pos2);

                if (! isWall(pos3.x, pos3.y))               
                    nextMoves.push(pos3);

                if (! isWall(pos4.x, pos4.y))               
                    nextMoves.push(pos4);
            }

            moves = nextMoves;
            step++;
        }
        return -1;
    }

    var steps = execute([{ x: 1, y: 1 }], 0);

    if (steps < 0)
        console.log("Failed!");
    else
        console.log("Resolved in " + steps);

    process.exit(0);
}