module.exports = function()
{
    const fs = require('fs');
    const readline = require('readline');

    const readInput = readline.createInterface({
    input: fs.createReadStream('Data/Day07.data')
    });

    //console.log(isABA('aba[bab]xyz')); // supports SSL (aba outside square brackets with corresponding bab within square brackets).
    //console.log(isABA('xyx[xyx]xyx')); // does not support SSL (xyx, but no corresponding yxy).
    //console.log(isABA('aaa[kek]eke')); // supports SSL (eke in supernet with corresponding kek in hypernet; the aaa sequence is not related, because the interior character must be different).
    //console.log(isABA('zazbz[bzb]cdb'));// supports SSL (zaz has no corresponding aza, but zbz has a corresponding bzb, even though zaz and zbz overlap).

    var TLSCount = 0;
    var SSLCount = 0;
    var total = 0;

    readInput
    .on('line', (ip) => { 
        total++;
        if (isABA(ip))
            SSLCount++;
        if (isABBA(ip))
            TLSCount++;
    })
    .on('close', () => {
        console.log("Done ...");
        console.log(TLSCount + " IPs support TLS out of " + total);
        console.log(SSLCount + " IPs support SSL out of " + total);
        process.exit(0);
    });

    function isABA(value)
    {  
        var abas = [];
        var babs = [];
        var inside = false;

        for(var i = 0; i < value.length-2; i++)
        {
            var c1 = value[i];
            var c2 = value[i+1];
            var c3 = value[i+2];

            if (c1 == '[')
            {
                inside = true;
                continue;
            }

            if (c1 == ']')
            {
                inside = false;
                continue;
            }

            if (c2 == ']' || c2 == '[' ||
                c3 == ']' || c3 == '[')
                continue;

            if (c1 == c3 && c1 != c2)
            {
                if (inside)
                    babs.push(c2+c1);
                else
                    abas.push(c1+c2);
            }
        }

        if (babs.length == 0 || abas.length == 0)
            return false;

        var ok = false;
        babs.forEach(function(bab) 
        {
            var found = false;
            abas.forEach(function(aba)
            {
                if (aba == bab)
                    found = true;
            })

            if (found)
                ok = true;
        });

        return ok;
    }

    function isABBA(value)
    {
        var inside = false;
        var ok = false;

        for(var i = 0; i < value.length-3; i++)
        {
            var c1 = value[i];
            var c2 = value[i+1];
            var c3 = value[i+2];
            var c4 = value[i+3];

            if (c1 == '[')
            {
                inside = true;
                continue;
            }

            if (c1 == ']')
            {
                inside = false;
                continue;
            }

            if (c2 == ']' || c2 == '[' ||
                c3 == ']' || c3 == '[' ||
                c4 == ']' || c4 == '[')
                continue;

            if (c1 == c4 && c2 == c3 && c1 != c2)
            {
                if (inside)
                    return false;
                else
                    ok = true;
            }
        }

        return ok;
    }
}
