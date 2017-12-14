module.exports = function()
{
    function makeList(size)
    {
        if (size === undefined)
            size = 256;
            
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

    this.getKnotHash = function(input, listSize)
    {
        let list = makeList(listSize);
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

        return hash;
    }

    this.testHash = function(input, listSize)
    {
        let list = makeList(listSize);
        // convert string to array of numbers

        let lengths = input.split(',');
        for(let i = 0; i < lengths.length; i++)
            lengths[i] = +lengths[i];

        //

        hashList(list, lengths, 1); // Only once
        return list[0] * list[1];
    }
}