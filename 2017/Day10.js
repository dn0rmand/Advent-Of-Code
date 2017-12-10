module.exports = function()
{
    function makeList(size)
    {
        let list = [];

        for(let i = 0; i < size; i++)
            list.push(i);

        return list;
    }

    function hashList(list, lengths, times)
    {
        let count = list.length;
        let skip    = 0;
        let current = 0;

        for(let time = 0; time < times; time++)
        {
            for (let i = 0; i < lengths.length; i++)
            {
                let start = current;
                let end   = current+lengths[i]-1;
                while (start < end)
                {
                    let tmp1 = list[start % count];
                    list[start % count] = list[end % count];
                    list[end % count] = tmp1;

                    end--;
                    start++;
                }

                current += (lengths[i] + skip);
                skip += 1;
            }
        }
    }

    function toHex(value)
    {
        const hexMap = '0123456789abcdef';

        return hexMap[(value >> 4) & 0xF] + hexMap[value & 0xF];
    }

    function processPart2(list, input, expected)
    {
        let lengths = [];
        for(let i = 0; i < input.length; i++ )
            lengths.push(input.charCodeAt(i));
        lengths.push(17, 31, 73, 47, 23);

        hashList(list, lengths, 64); // 64 times

        let hash = '';

        for(let i = 0; i < 256; i += 16)
        {
            let value = list[i];
            for (let j = 1; j < 16; j++)
                value ^= list[i+j];

            hash += toHex(value);
        }

        dump(2, hash, expected);
    }

    function processPart1(list, input, expected)
    {
        // convert string to array of numbers

        let lengths = input.split(',');
        for(let i = 0; i < lengths.length; i++)
            lengths[i] = +lengths[i];

        //

        hashList(list, lengths, 1); // Only once
        dump(1, list[0] * list[1], expected);
    }

    function dump(part, result, expected)
    {
        part = 'Part ' + part + ': ';

        if (expected === undefined)
            console.log(part + result);
        else if (result === expected)
            console.log(part + result + ' ( ' + expected + ' )');
        else
            console.log(part + 'Failed! Got ' + result + ' but should be ' + expected);    
    }

    const puzzleInput = '230,1,2,221,97,252,168,169,57,99,0,254,181,255,235,167';
    
    // Tests
    processPart1(makeList(5), '3, 4, 1, 5', 12);

    // Real stuff
    processPart1(makeList(256), puzzleInput);

    // Tests for Part 2
    processPart2(makeList(256), '', 'a2582a3a0e66e6e86e3812dcb672a272');
    processPart2(makeList(256), 'AoC 2017', '33efeb34ea91902bb2f59c9920caa6cd');
    processPart2(makeList(256), '1,2,3', '3efbe78a8d82f29979031a4aa0b16a9d');
    processPart2(makeList(256), '1,2,4', '63960835bcdc130f0b66d7ff4f6a5a8e');

    // Real stuff
    processPart2(makeList(256), puzzleInput);

    process.exit(0);
}