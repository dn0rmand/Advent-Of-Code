module.exports = function() 
{
    const crypto = require('crypto');
    var input = 'bgvyzdsv';
    var index = -1;

    while(true)
    {
        index++;
        var key = input + index;
        var hash = crypto.createHash('md5').update(key).digest("hex");

        if (hash.startsWith('000000'))
        {
            console.log("Result is " + index);
            break;
        }
    }

    process.exit(0);
}