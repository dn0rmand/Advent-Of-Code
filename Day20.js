module.exports = function()
{
    const assert    = require('assert');
    const fs        = require('fs');
    const readline  = require('readline');
    
    const maxIpCount = 4294967296;

    var exclusions = [];

    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day20.data')
    });

    readInput
    .on('line', (line) => { 
        parseIP(line);
    })
    .on('close', () => {
        sort();
        var ip = calculate1();
        console.log("First non-excluded ip is " + ip);
        var ips = calculate2();
        console.log("Total good ips is " + ips);
        process.exit(0);
    });

    function sort()
    {
        exclusions.sort(function(e1, e2) {
            var s = e1.start - e2.start;
            if (s == 0)
                s = e1.end - e2.end;
            return s > 0 ? 1 : (s < 0 ? -1 : 0);
        });
    }

    function calculate1()
    {
        var start = 0;
        for(var i =0 ; i < exclusions.length; i++) 
        {
            var e = exclusions[i];
            if (start < e.start) {
                return start;
            }
            if (start <= e.end)
                start = e.end+1;
        }

        return -1;
    }

    function calculate2()
    {
        var ips = maxIpCount;

        var lastEnd;
        for(var i = 0; i < exclusions.length; i++) {
            var e = exclusions[i];
            var s = e.start;

            if (i != 0)
            {
                if (s < lastEnd)
                    s = lastEnd;
            }
            
            if (e.end >= s) 
            {
                var c = (e.end - s) + 1;
                console.log(c);
                ips -= c;
                lastEnd = e.end + 1;
            }
        }

        assert(ips >= 0);
        return ips;
    }

    function parseIP(line)
    {
        var range = line.split('-');
        var start = +(range[0]);
        var end   = +(range[1]); 

        assert(start < end);

        var range   = {start: start, end: end };
        var add     = true;

        if (add)
            exclusions.push({start:start, end:end});
    }
}