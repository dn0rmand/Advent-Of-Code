const day14 = module.exports = function()
{
    const crypto = require('crypto');
    
    var input = 'qzyelonm';
    //var input = 'abc'
    var hashes = [];

    function getHash(idx)
    {
        var hash = hashes[idx];
        if (hash === undefined)
        {
            var key  = input + idx;
        
            hash = crypto.createHash('md5').update(key).digest("hex");

            for(var i = 0 ; i < 2016 ; i++)
                hash = crypto.createHash('md5').update(hash).digest("hex");

            hashes[idx] = hash;
        }
        return hash;
    }

    function valid(hash)
    {
        for(var i = 0; i+2 < hash.length; i++)
        {
            var c1 = hash[i];
            var c2 = hash[i+1];
            var c3 = hash[i+2];

            if (c1 == c2 && c1 == c3)
                return c1+c1+c1+c1+c1;
        }

        return undefined;
    }

    function isKey(idx)
    {
        var hash  = getHash(idx);
        var match = valid(hash);

        if (match !== undefined)
        {
            for(var i = 0; i < 1000; i++)
            {
                var h = getHash(idx + i + 1);
                if (h.indexOf(match) >= 0)
                    return true;
            }
        }

        return false;
    }

    // initialize();

    var found = 0;
    var idx   = 0;

    while (found < 64)
    {
        if (isKey(idx))
        {
            found++;
            process.stdout.write("\rindex " + idx + " for key " + found);
        }
        // getNextHash();
        idx++;
    }

    console.log('');
    process.exit(0);
}

day14();