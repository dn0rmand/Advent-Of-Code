module.exports = function() 
{
    const input = '3113322113';

    var data = input;
    for(var i = 0; i < 40; i++)
    {
        data = lookAndSay(data);
    }

    console.log("After 40 times, length is " + data.length);

    for(var i = 0; i < 10; i++)
    {
        data = lookAndSay(data);
    }

    console.log("After 50 times, length is " + data.length);

    process.exit(0);

    function lookAndSay(data)
    {
        var newData = "";
        var previous;
        var count = 0;

        for(var i = 0; i < data.length; i++)
        {
            var c = data[i];
            if (c == previous)
            {
                count++;
            }
            else if (count > 0)
            {
               if (count > 9)
                console.log(count);
               newData += count + previous;
               previous = c;
               count = 1;
            }
            else
            {
                previous = c;
                count    = 1;
            }
        }
        if (count > 0)
        {
            newData += count + previous;
            previous = c;
            count = 1;            
        }

        return newData;
    }
}