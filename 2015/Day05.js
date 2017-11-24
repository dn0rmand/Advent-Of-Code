module.exports = function() 
{
    const fs = require('fs');
    const readline = require('readline');

    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day05.data')
    });

    var badPairs = {
        ab: 1,
        cd: 1,
        pq: 1,
        xy: 1
    };

    // isGoodString2('qjhvhtzxzqqjkmpb');
    // isGoodString2('xxyxx');
    // isGoodString2('uurcxstgmygtbstg');
    // isGoodString2('ieodomkazucvgmuy');

    // process.exit(0);

    var goodStrings1 = 0;
    var goodStrings2 = 0;

    readInput
    .on('line', (line) => { 
        if (isGoodString1(line))
            goodStrings1++; 
        if (isGoodString2(line))
            goodStrings2++; 
    })
    .on('close', () => {
        console.log(goodStrings1 + " good strings version 1");
        console.log(goodStrings2 + " good strings version 2");
        process.exit(0);
    });
    
    /*
        It contains a pair of any two letters that appears at least twice in the string without overlapping, like xyxy (xy) or 
        aabcdefgaa (aa), but not like aaa (aa, but it overlaps).
        It contains at least one letter which repeats with exactly one letter between them, like xyx, abcdefeghi (efe), or 
        even aaa.   
    */
    function isGoodString2(line) 
    {
        var criteria1 = false;
        var criteria2 = false;

        // Check criteria 1
        for(var i = 0; i < line.length-2; i++)
        {
            var c1 = line[i];
            var c2 = line[i+2];
            if (c1 == c2)
            {
                criteria1 = true;
                break;
            }
        }

        // Check criteria 2
        for(var i = 0; i < line.length ; i++)
        {
            var c1 = line[i];
            var c2 = line[i+1];

            for(var j = i+2; j < line.length; j++)
            {
                var c3 = line[j];
                var c4 = line[j+1];
                if (c1 == c3 && c2 == c4)
                {
                    criteria2 = true;
                    break;
                }
            }

            if (criteria2)
                break;
        }

        if (criteria1 && ! criteria2)
            console.log(line + ' is naughty due to criteria 2');

        return (criteria1 && criteria2);
    }

    /*
    A nice string is one with all of the following properties:

    It contains at least three vowels (aeiou only), like aei, xazegov, or aeiouaeiouaeiou.
    It contains at least one letter that appears twice in a row, like xx, abcdde (dd), or aabbccdd (aa, bb, cc, or dd).
    It does not contain the strings ab, cd, pq, or xy, even if they are part of one of the other requirements.
    */
    function isGoodString1(line) 
    {
        var previous = '_';
        var vowels = 0;
        var pairs  = 0;

        for(var i = 0; i < line.length; i++)
        {
            var c = line[i];
            if (badPairs[previous + c] === 1)
                return false; // Bad String

            if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u')
                vowels++;
            if (previous == c)
                pairs++;
            previous = c;
        }

        return pairs > 0 && vowels > 2;
    }
}