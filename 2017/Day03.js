module.exports = function()
{
    const puzzleInput = 325489;
    
    const RIGHT=1;
    const UP=2;
    const LEFT=3;
    const DOWN=4;

    let current=1;
    let x=0;
    let y=0;
    let min=0, max=0;
    let direction=RIGHT;

    function reset()
    {
        current=1;
        x=0;
        y=0;
        min=0;
        max=0;
        direction=RIGHT;            
    }

    function move()
    {            
        let done = false;

        while (! done)
        {
            done = true;
            switch (direction)
            {
                case RIGHT:
                    x++;
                    if (x > max)
                    {
                        max++;
                        min--;
                        direction=UP;
                    }
                    break;
                case UP:
                    if (y > min)
                    {
                        y--;
                    }
                    else
                    {
                        direction = LEFT;
                        done = false;
                    }
                    break;
                case LEFT:
                    if (x > min)
                    {
                        x--;
                    }
                    else
                    {
                        direction = DOWN;
                        done = false;
                    }
                    break;
                case DOWN:
                    if (y < max)
                    {
                        y++;
                    }
                    else
                    {
                        direction = RIGHT;
                        done = false;
                    }
            }
        }
    }

    function part1()
    {        
        reset();

        let target = puzzleInput;

        while (current != target)
        {
            move();
            current++;
        }

        let steps = Math.abs(x) + Math.abs(y);
        console.log(target + " => " + x + "," + y + " Steps: " + steps);
    }

    function part2()
    {        
        reset();

        let memory = {};

        function get(x, y)
        {
            let key = '$'+x+','+y;

            return memory[key] || 0;
        }

        function set(x, y, value)
        {
            let key = '$'+x+','+y;
            
            return memory[key] = value;                       
        }

        let target = puzzleInput;

        set(0,0,1);

        while (true)
        {
            move();

            var v = get(x, y)   + get(x, y-1) + get(x, y+1) +
                    get(x-1, y) + get(x-1, y-1) + get(x-1, y+1) +
                    get(x+1, y) + get(x+1, y-1) + get(x+1, y+1)

            set(x, y, v);

            if (v > target)
            {
                console.log(x + "," + y + " => " + v);
                break;
            }
        }
    }

    part1();
    part2();            
}
