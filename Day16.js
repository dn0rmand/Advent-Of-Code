module.exports = function()
{
    const input = '10111100110001111';
    const discSize = 35651584;

    var buffer = new Array(discSize);//[];

    function builtArray()
    {
        for(var i = 0; i < input.length; i++)
            buffer[i] = +input[i];

        var index = input.length;

        while (index < discSize)
        {
            var idx = index;
            buffer[idx++] = 0;
            for(var i = 0 ; idx < discSize && i < index; i++)
            {
                var c = buffer[index - 1 - i];
                buffer[idx++] = c ^ 1;
            }
            index = idx;
        }
        console.log('Array created');
    }

    function makeChecksum(len)
    {
        var j = 0;

        for(var i = 0; i < len-1; i += 2)
        {
            var c1 = buffer[i];
            var c2 = buffer[i+1];

            buffer[j++] = (c1 == c2) ? 1 : 0;        
        }
    }

    builtArray();

    var len = discSize;

    while( (len & 1) != 1)
    {
        makeChecksum(len);
        len = len / 2;
    }

    var x = buffer.slice(0, len)
    console.log(x.join(''));

    process.exit(0);
}