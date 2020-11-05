module.exports = async function()
{
    const assembunny = require("../tools/assembunny.js");

    var compiler = assembunny.create();
    
    await compiler.parse("Data/Day25.data");

    compiler.compile();

    let previous = 1;
    let count = 0;
    let failed ;

    compiler.transmit = function(value)
    {
        if (value === previous || (value !== 0 && value !== 1))
        {
            failed = true;
            compiler.$current = compiler.$instructions.length+10;
        }
        else
        {
            previous = value;
            count++;
            if (count > 50)
            {
                failed = false;
                compiler.$current = compiler.$instructions.length+10;
            }
        }
    }

    let a = 0;
    do
    {
        count = 0;
        previous = 1;
        compiler.$registers.a = ++a;
        compiler.execute();
    }
    while (failed);

    console.log("Part 1: A = " + a);
    process.exit(0);
};
