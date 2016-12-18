module.exports = function()
{
    var input = 'R1, L4, L5, L5, R2, R2, L1, L1, R2, L3, R4, R3, R2, L4, L2, R5, L1, R5, L5, L2, L3, L1, R1, R4, R5, L3, R2, L4, L5, R1, R2, L3, R3, L3, L1, L2, R5, R4, R5, L5, R1, L190, L3, L3, R3, R4, R47, L3, R5, R79, R5, R3, R1, L4, L3, L2, R194, L2, R1, L2, L2, R4, L5, L5, R1, R1, L1, L3, L2, R5, L3, L3, R4, R1, R5, L4, R3, R1, L1, L2, R4, R1, L2, R4, R4, L5, R3, L5, L3, R1, R1, L3, L1, L1, L3, L4, L1, L2, R1, L5, L3, R2, L5, L3, R5, R3, L4, L2, R2, R4, R4, L4, R5, L1, L3, R3, R4, R4, L5, R4, R2, L3, R4, R2, R1, R2, L4, L2, R2, L5, L5, L3, R5, L5, L1, R4, L1, R1, L1, R4, L5, L3, R4, R1, L3, R4, R1, L3, L1, R1, R2, L4, L2, R1, L5, L4, L5';

    var map = [];

    for(var y = 0; y < 600; y++)
    {
        map[y] = [];
        for(var x = 0; x < 600; x++)
            map[y][x] = 0;
    }

    var position  = { x:0, y:0  };
    var direction = { x:0, y:1 };

    var done = false;

    input.split(',').forEach(function(entry) {
        if (done)
            return;

        entry = entry.trim();
        var d = entry[0];
        var blocks = entry.substring(1);

        blocks = +blocks;

        if (direction.x == 0 && direction.y == 1)
        {
            if (d == 'R')
                direction = {x: 1, y:0};
            else
                direction = {x:-1, y:0};        
        }
        else if (direction.x == 1  && direction.y == 0)
        {
            if (d == 'R')
                direction = {x:0, y:-1};
            else
                direction = {x:0, y:1};        
        }
        else if (direction.x == 0 && direction.y == -1)
        {
            if (d == 'R')
                direction = {x:-1, y:0};
            else
                direction = {x:1, y:0};        
        }
        else if (direction.x == -1 && direction.y == 0)
        {
            if (d == 'R')
                direction = {x:0, y:1};
            else
                direction = {x:0, y:-1};        
        }

        for(var b = 0; b < blocks; b++)
        {
            position.x += direction.x;
            position.y += direction.y; 

            if (map[position.y+300][position.x+300] == 1)
            {
                done = true;
                break;
            } 
            map[position.y+300][position.x+300] = 1; 
        }
    });

    var blocks = Math.abs(position.y) + Math.abs(position.x);
    console.log(blocks);
    process.exit(0);
}