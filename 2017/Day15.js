module.exports =function()
{
    function *generatorA1(count, mask) 
    {
        let A = 722;
        while (count > 0) 
        {
            A = (A * 16807) % 2147483647;

            if (mask === undefined || (A & mask) === 0)
            {
                count--;
                yield A & 0xFFFF;
            }
        }
    }

    function *generatorB1(count, mask) 
    {
        let B = 354;
        while (count > 0) 
        {
            B = (B * 48271) % 2147483647;

            if (mask === undefined || (B & mask) === 0)
            {
                count--;
                yield B & 0xFFFF;
            }
        }
    }
      
    function solve(count, maskA, maskB)
    {
        let a = generatorA1(count, maskA);
        let b = generatorB1(count, maskB);
        let matches = 0;

        while(true)
        {
            let v1 = a.next();
            let v2 = b.next();

            if (v1.done || v2.done)
                break;

            if (v1.value === v2.value)
                matches++;
        }

        return matches;
    }

    console.log("Part 1 = " + solve(40000000) + " and Part 2 = " + solve(5000000, 3, 7));
    process.exit(0);    
}