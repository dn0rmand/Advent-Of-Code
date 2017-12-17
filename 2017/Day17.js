module.exports = function()
{
    const steps = 348;

    function solve1()
    {
        let buffer   = [0];
        let position = 0;

        for(let i = 0; i < 2017; i++)
        {
            position = ((position + steps) % buffer.length) + 1;
            buffer.splice(position, 0, i+1);
        }

        return buffer[(position+1) % buffer.length];
    }

    function solve2()
    {
        let length = 1;
        let position = 0;
        let value = 0;

        for(let i = 0; i < 50000000; i++)
        {
            position = ((position + steps) % length) + 1;
            length += 1
            if (position === 1)
                value = i+1;
        }

        return value;
    }

    console.log("Part 1: " + solve1());
    console.log("Part 2: " + solve2());

    process.exit(0)
};