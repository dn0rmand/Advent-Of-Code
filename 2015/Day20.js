module.exports = function() 
{
    const isFloat = require('is-float');
    const input = 34000000;

    function delivers(house, elf, v2)
    {
        var s = house / elf;
        if (Math.floor(s) != s)
            return false;
        if (v2)
            return (elf * 50) >= house;
        else
            return true;
    }

    function getPresentCountV1(house)
    {
        var presents = 0;
        
        for(var elf = 1; elf <= house; elf++)
        {
            if (delivers(house, elf, false))
                presents += (10*elf);
        }

        return presents;
    }

    function getPresentCountV2(house)
    {
        var presents = 0;
        
        for(var elf = 1; elf <= house; elf++)
        {
            if (delivers(house, elf, true))
                presents += (11*elf);
        }

        return presents;
    }

    function runTest(fn)
    {
        for(var h = 1; h < 10; h++)
        {
            var p = fn(h);
            console.log("House " + h + " get " + p + " presents.");
        }
    }

    // console.log("Test for Part 1");
    // runTest(getPresentCountV1);

    // console.log("Test for Part 2");
    // runTest(getPresentCountV2);

    var house = 509000;

    while(true)
    {
        var presents = getPresentCountV2(house);
        if ((house % 100) == 0)
            process.stdout.write("\r" + house + ' -> ' + (input-presents) + " missing presents   ");
        if (presents >= input) 
        {
            console.log('');
            console.log("House " + house + " -> " + presents + " presents");
            break;
        }
        house++;
    }

    process.exit(0);
}