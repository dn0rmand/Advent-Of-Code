module.exports = function()
{
    const fs = require('fs');
    const readline = require('readline');

    const readInput = readline.createInterface({
    input: fs.createReadStream('Data/Day09.data')
    });

    var result = 0;
    var total  = 0;

    console.log(processLine('(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN'));

    readInput
    .on('line', (line) => { 
        total += line.length;
        result+= processLine(line);
    })
    .on('close', () => {
        console.log(total + ' -> ' + result);
        process.exit(0);
    });

    function processLine(line)
    {
        var index = 0;
        var decompress = 0;

        function getNumber()
        {
            var value = 0;
            var started = false;

            while(index < line.length)
            {
                var c = line[index++];
                if (c >= '0' && c <= '9')
                {
                    started = true;
                    value = (value * 10) + (+c);
                }
                else if (started)
                    break;
            }
            return value;
        }  

        while (index < line.length)
        {
            var c = line[index++];
            if (c == '(')
            {
                var chars = getNumber();
                var count = getNumber();

                var s = "";
                for (var i = 0; i < chars ; i++)
                {
                    s += line[index++];
                }

                var l = s.length;

                if (s.indexOf('(') >=0)
                    l = processLine(s);

                decompress += (l * count);
            }
            else
                decompress += 1;
        }    

        return decompress;
    }
}