module.exports = function()
{
    const assert = require('assert');
    const fs = require('fs');
    const readline = require('readline');

    const readInput = readline.createInterface({
        input: fs.createReadStream('2015/Data/Day24.data')
    });

    var items = [];

    readInput
    .on('line', (line) => { 
        items.push(+line);
    })
    .on('close', () => {
        var qe = search(3 - 1); // 1 + 2
        console.log("PART1: QE = " + qe);
        var qe = search(4 - 1); // 1 + 3
        console.log("PART2: QE = " + qe);
        process.exit(0);
    });

    function search(groupCount)
    {
        var splits = splitItems(items, groupCount);
        var minLen = items.length+1;

        splits = splits.sort( function(v1, v2) {
            var l1 = v1[0].length;
            var l2 = v2[0].length;
            minLen = Math.min(l1, l2, minLen);
            return l1-l2;
        });

        var maxQE = undefined;
        for(var i = 0; i < splits.length; i++)
        {
            var split = splits[i];
            if (split[0].length > minLen)
                break

            var qe = split[0][0];
            for(var j = 1; j < split[0].length; j++)
            {
                qe *= split[0][j];
            }
            if (maxQE === undefined)
                maxQE = qe;
            else
                maxQE = Math.min(maxQE, qe);
        }

        return maxQE;
    }

    function splitItems(values, groupCount)
    {
        var m = (1 << values.length)-1;

        var result  = [];
        var percent = -1;

        for (var i = 0 ; i < m-1 ; i++) 
        {
            var p = Math.floor((i / m)*100);
            if (p != percent)
            {
                percent = p;
                process.stdout.write('\r'+p+"%");
                global.gc();
            }

            if (i > (m^i)) 
                continue

            var l1 = [];
            var l2 = [];
            var s1 = 0;
            var s2 = 0;

            for (var j = 0 ; j < values.length; j++) 
            {
                var v = values[j];
                var x = 1 << j;
                if (x & i) 
                {
                    s2 += v;
                    l2.push(v);
                }
                else
                {  
                    s1 += v;
                    l1.push(v);
                }
            }

            // Check if valid: sum(l1)*2 = sum(l2)
            if (s1 * groupCount === s2)
                result.push([l1, l2]);
            if (s2 * groupCount === s1)
                result.push([l2, l1]);
        }        

        console.log();
        return result;
    }
}
