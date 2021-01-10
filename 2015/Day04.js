module.exports = function() 
{
    const crypto = require('crypto');
    var input = 'bgvyzdsv';

    var md5 = crypto.createHash('md5');

    function run(part, check)
    {
        var index = -1;
        while(true)
        {
            index++;
            var key  = input + index;
            var hash = md5.copy().update(key).digest();

            if (hash[0] === 0 && hash[1] === 0 && hash[2] <= check)
            {
                console.log(`Result for part ${part} is ${index}`);
                break;
            }
        }
    }

    run(1, 15);
    run(2, 0);
    process.exit(0);
}
