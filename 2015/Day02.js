module.exports = function() 
{
    const fs = require('fs');
    const readline = require('readline');

    const readInput = readline.createInterface({
    input: fs.createReadStream('2015/Data/Day02.data')
    });

    //var presents = [];

    var paper = 0;
    var bow = 0;

    readInput
    .on('line', (room) => { parsePresent(room); })
    .on('close', () => {
        console.log("Need " + paper + " Sq feet of paper");
        console.log("Need " + bow + " feet of ribbon");
        process.exit(0);
    });

    function parsePresent(line)
    {
        var dim = line.split('x');
        var w = +(dim[0]);
        var h = +(dim[1]);
        var l = +(dim[2]);  

        var s1 = l*w;
        var s2 = w*h;
        var s3 = h*l;

        var surf = ((s1+s2+s3)*2)+Math.min(s1, s2, s3); 

        paper += surf;

        var b = (w+h+l - Math.max(w, h, l)) * 2;
        b += w*h*l;

        bow += b;
    }
}