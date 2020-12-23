const day23 = module.exports = function()
{
    const DAY = +(__filename.match(/^.*\/day(\d*)\.js$/)[1]);

    const INPUT = '318946572';

    function loadData(part)
    {
        const input = {
            map: [],
            list: undefined,
            max: 0,
        };

        let first = undefined;
        let last = undefined;

        const addValue = value => {
            input.max = Math.max(value, input.max);

            const o = { value };

            input.map[value] = o;
            if (first) {
                last.next = o;
                last = o;
            } else {
                first = last = o;
            }
        };

        for(let i = 0; i < INPUT.length; i++) {
            const value = +(INPUT[i]);

            addValue(value);
        }

        if (part === 2) {
            while (input.max <  1000000) {
                addValue(input.max+1);
            }
        }

        last.next = first;
        input.list = first;
        return input;
    }

    function run({ list, map, max }, moves)
    {
        let current = list;

        for(let move = 0; move < moves; move++) {
            const section = [ current.next, current.next.next, current.next.next.next ];

            let target = current.value-1;
            if (target <= 0)
                target = max;

            while (section.some(v => target === v.value))
            {
                if (--target <= 0)
                    target = max;
            }

            target  = map[target];
            current = current.next = section[2].next;

            section[2].next = target.next;
            target.next = section[0];
        }

        return map;
    }

    function part1()
    {
        const map = run(loadData(1), 100);

        let result = '';
        for(let o = map[1].next; o.value !== 1; o = o.next)
            result += o.value;

        return result;
    }

    function part2()
    {
        const map = run(loadData(2), 10000000);

        const one = map[1];
        const cup1 = one.next.value;
        const cup2 = one.next.next.value;

        return cup1 * cup2;
    }

    console.log(`--- Advent of Code day ${DAY} ---`);

    console.time(`${DAY}-part-1`);
    console.log(`Part 1: ${part1()}`);
    console.timeLog(`${DAY}-part-1`, `to execute part 1 of day ${DAY}`);

    console.time(`${DAY}-part-2`);
    console.log(`Part 2: ${part2()}`);
    console.timeLog(`${DAY}-part-2`, `to execute part 2 of day ${DAY}`);
};

day23();