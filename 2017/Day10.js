module.exports = function()
{
    const knotHashes = require('../tools/knotHashes.js');

    let knotHash = new knotHashes();

    function processPart2(listSize, input, expected)
    {
        let hash = knotHash.getKnotHash(input, listSize);

        dump(2, hash, expected);
    }

    function processPart1(listSize, input, expected)
    {
        let value = knotHash.testHash(input, listSize);
        dump(1, value, expected);
    }

    function dump(part, result, expected)
    {
        part = 'Part ' + part + ': ';

        if (expected === undefined)
            console.log(part + result);
        else if (result === expected)
            console.log(part + result + ' ( ' + expected + ' )');
        else
            console.log(part + 'Failed! Got ' + result + ' but should be ' + expected);    
    }

    const puzzleInput = '230,1,2,221,97,252,168,169,57,99,0,254,181,255,235,167';
    
    // Tests
    processPart1(5, '3, 4, 1, 5', 12);

    // Real stuff
    processPart1(256, puzzleInput);

    // Tests for Part 2
    processPart2(256, '', 'a2582a3a0e66e6e86e3812dcb672a272');
    processPart2(256, 'AoC 2017', '33efeb34ea91902bb2f59c9920caa6cd');
    processPart2(256, '1,2,3', '3efbe78a8d82f29979031a4aa0b16a9d');
    processPart2(256, '1,2,4', '63960835bcdc130f0b66d7ff4f6a5a8e');

    // Real stuff
    processPart2(256, puzzleInput);

    process.exit(0);
}