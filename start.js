const   prompt = require('prompt');
const   fs = require("fs");
const   prettyHrtime = require('pretty-hrtime');

process.$exit = process.exit;

console.log("Advent of Code");

prompt.start();

var properties = [
    {
        name: 'year',
        type: 'integer',
        required: true,
        message: 'What year (1:2015, 2:2016, 3:2017)?',
        minimum:1,
        maximum:3,
        warning: 'Enter either 1,2 or 3',
        default: '3',
        before: function(value) { return value+2014; }
    },
    {
        name: 'day',
        type: 'integer',
        required: true,
        message: 'What day (1 to 25)?',
        minimum:1,
        maximum:25,
        warning: 'Enter a day number between 1 and 25',
        default: '1'
    }
];

prompt.get(properties, function (err, result) 
{
    var path = "./" + result.year;
    var filename = path + "/Day";

    if (result.day < 10)
        filename += "0";
    
    filename += result.day + ".js";

    if (fs.existsSync(filename))
    {
        const day = require(filename);

        process.chdir(path);

        console.log("");
        console.log("Executing Day " + result.day + " of year " + result.year);
        console.log("");
        
        var start = process.hrtime();

        process.exit = function() 
        {
            var end = process.hrtime(start);
            var words = prettyHrtime(end, {verbose:true});
    
            console.log("")
            console.log("Executed in " + words);
            process.$exit(0);    
        };

        day();
    }
    else
    {
        console.log(filename + " not found");
    }
});
