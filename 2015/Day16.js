module.exports = function() 
{
    const assert    = require('assert');
    const fs        = require('fs');
    const readline  = require('readline');
    const parser    = require('../parser.js');

    const readInput = readline.createInterface({
        input: fs.createReadStream('2015/Data/Day16.data')
    });

    readInput
    .on('line', (line) => { 
        parseInput(line.toLowerCase());
    })
    .on('close', () => {
        console.log("Data loaded");
        var goodSues = filterSues();
        if (goodSues.length > 1)
            console.log("Too many sues ... Need more infos");
        else if (goodSues.length == 1)
            console.log("Matching sue found. Id is " + goodSues[0].id);
        else
            console.log("No sues ... To much infos");
        process.exit(0);
    });

    var sues = [];

    // Filter

    function filterSues()
    {
        function check(sue, name, value, delta) {
            var v = sue[name];
            if (v === undefined)
                return true;

            if (delta === 1)
                return v > value;
            else if (delta === -1)
                return v < value;
            else
                return v === value;
        }

        var valid = sues.filter( (sue) => {
            return  check(sue, "children", 3) &&
                    check(sue, "cats", 7, 1) &&
                    check(sue, "samoyeds", 2) &&
                    check(sue, "pomeranians", 3, -1) &&
                    check(sue, "akitas", 0) &&
                    check(sue, "vizslas", 0) &&
                    check(sue, "goldfish", 5, -1) &&
                    check(sue, "trees", 3, 1) &&
                    check(sue, "cars", 2) &&
                    check(sue, "perfumes", 1);
        });

        return valid;
    }
    // Sue 6: goldfish: 10, cats: 9, cars: 8

    function parseInput(line)
    {
        var parse = new parser(line.toLowerCase());

        var sue = {};

        parse.expectToken("sue");
        sue.id = parse.getNumber();
        parse.expectOperator(':')

        while (true)
        {
            var key = parse.getToken();
            parse.expectOperator(":");
            var value = parse.getNumber();

            sue[key] = value;

            if (parse.endOfLine())
                break;
            parse.expectOperator(',');
        }

        sues.push(sue);
    }
}