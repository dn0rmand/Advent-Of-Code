module.exports =function()
{
    const PART1_COUNT = 40000000;
    const PART2_COUNT = 5000000;
    const DIVIDER     = 2147483647;
    const A_FACTOR    = 16807;
    const B_FACTOR    = 48271;

    let A = []; A.length = PART2_COUNT;
    let B = []; B.length = PART2_COUNT;

    function generatorA() 
    {
        let count = PART1_COUNT;
        let value = lastAValue = 722;
        let ACount = 0;

        return function() 
        {
            if (count > 0) 
            {
                value = (value * A_FACTOR) % DIVIDER;

                let res = value & 0xFFFF;

                if (ACount < PART2_COUNT && (res & 3) === 0)
                {
                    A[ACount++] = res;
                    lastAValue = value; 
                }

                count--;
                return res;
            }
            else
            {
                // Finish filling A Array for part 2
                while (ACount < PART2_COUNT)
                {
                    value = (value * A_FACTOR) % DIVIDER;
                    if ((value & 3) === 0)
                        A[ACount++] = value & 0xFFFF;
                }
                return undefined; // means done!            
            }
        };
    }

    function generatorB() 
    {
        let count = PART1_COUNT;
        let value = 354;
        let BCount = 0;

        return function() 
        {
            if (count > 0) 
            {
                value = (value * B_FACTOR) % DIVIDER;
                let res = value & 0xFFFF;

                if (BCount < PART2_COUNT && (res & 7) === 0)
                    B[BCount++] = res;

                count--;
                return res;
            } 
            else
            {
                // Finish filling B Array for part 2
                while (BCount < PART2_COUNT)
                {
                    value = (value * B_FACTOR) % DIVIDER;
                    if ((value & 7) === 0)
                        B[BCount++] = value & 0xFFFF;
                }
                return undefined; // means done!            
            }
        };
    }

    function solve1()
    {
        let a = generatorA();
        let b = generatorB();

        let matches = 0;

        while(true)
        {
            let v1 = a();
            let v2 = b();

            if (v1 === undefined || v2 === undefined)
                break;

            if (v1 === v2)
                matches++;
        }

        return matches;
    }

    function solve2()
    {
        let matches = 0;
        for(let i = 0; i < PART2_COUNT; i++)
        {
            if (A[i] === B[i])
                matches++;
        }
        return matches;
    }

    console.log("Part 1 = " + solve1() + " and Part 2 = " + solve2());
    process.exit(0);    
}