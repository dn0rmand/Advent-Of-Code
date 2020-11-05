const day20 = function () 
{
    const TARGET = 34000000;
    const MAX_HOUSE = 1000000;

    function part1() 
    {
        const houses = new Uint32Array(MAX_HOUSE);
        houses.fill(10); // Elf 1
        for (let elf = 2; elf < MAX_HOUSE; elf++) 
        {
            for (let i = elf; i < MAX_HOUSE; i += elf) 
            {
                houses[i] += elf * 10;
            }
        }
        const result = houses.findIndex(v => v >= TARGET)
        console.log(`\rPart1 - First house to get at least ${TARGET} presents is house #${result}`);
        return result;
    }

    function part2() 
    {
        const houses = new Uint32Array(MAX_HOUSE);

        for (let elf = 1; elf < MAX_HOUSE; elf++) 
        {
            for (let i = elf, p = 50; p && i < MAX_HOUSE; i += elf, p--) 
            {
                houses[i] += elf * 11;
            }
        }
        const result = houses.findIndex(v => v >= TARGET)
        console.log(`\rPart2 - First house to get at least ${TARGET} presents is house #${result}`);
        return result;
    }

    part1();
    part2();
    process.exit(0);
}

module.exports = day20;