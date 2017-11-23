module.exports = function()
{
    const crypto = require('crypto');
    const input = 'wtnhxymk';

    /*
    var seed = 0;
    var password = "";

    while (password.length < 8)
    {
        var key  = input + (seed++);
        var hash = crypto.createHash('md5').update(key).digest("hex");
        if (hash.startsWith("00000"))
        {
            password += hash[5];
            console.log(hash + " -> " + password)
        }
    }

    console.log(password);
    */

    var seed = 2231250;

    var password = ['*', '*', '*', '*', '*', '*', '*', '*'];
    var count    = 0;
    var loop     = 0;
    while (count < 8)
    {
        var key  = input + (seed++);
        var hash = crypto.createHash('md5').update(key).digest("hex");
        if (hash.startsWith("00000"))
        {
            var index = +(hash[5]);
            if (isNaN(index) || index < 0 || index > 7)
                continue;
            if (password[index] == '*')
            {
                count++;
                password[index] = hash[6];
                loop = 0;
            }
        }
        if (loop == 0)
            process.stdout.write("\r" + seed  + ": " + password.join(''));
        loop = (loop + 1) % 1000;
    }
    console.log('');
    console.log("Seed: "+seed);
    console.log("Password: " + password.join(''));
    process.exit(0);
}
