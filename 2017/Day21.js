module.exports = function()
{
    //#region FWK - Read file and load required modules
    const fs = require('fs');
    const readline = require('readline');
    const parser = require('../tools/parser.js');
    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day21.data')
    });

    readInput.on('line', (line) => processLine(line)).on('close', () => { dumpResult(); process.exit(0); });
    //#endregion

    let image = [
        ['.','#','.'],
        ['.','.','#'],
        ['#','#','#']
    ];

    let patterns3 = {

    };
    let patterns4 = {

    };

    function dumpResult()
    {
        let output = solve(image, 5, 1, 162);
        solve(output, 18 - 5, 2, 2264586);
    }

    function solve(image, steps, part, expected)
    {
        let output = execute(image, steps);

        let pixels = 0;

        for(let y = 0; y < output.length; y++)
            for(let x =0; x < output.length; x++)
                if (output[y][x] === '#')
                    pixels++;
                    
        console.log("Part " + part + ": " + pixels + " pixels (" + expected + ")");  
        return output;
    }

    function execute(image, steps)
    {
        function makeKey(input, x, y, size)
        {
            let key = '';

            for(let yy = 0; yy < size; yy++)
            {
                if (yy > 0)
                    key += '/';

                for(let xx = 0; xx < size ; xx++)
                {
                    key += input[y+yy][x+xx];
                }
            }

            return key;
        }

        function set(output, x, y, value)
        {
            let line = output[y];
            if (line === undefined)
                line = output[y] = [];
            line[x] = value;
        }

        function dump(image)
        {
            console.log(image.length + "x" + image.length);

            for(let y = 0; y < image.length; y++)
            {
                let s = image[y].join('');
                console.log(s);
            }            
        }

        let output = image;

        while (steps-- > 0)
        {
            let input = output;
            output = [];

            let size = input.length;
            let newSize;
            let patterns;

            if ((size % 2) !== 0)
            {
                size = 3;
                newSize = 4; 
                patterns = patterns4;
            }
            else
            {
                size = 2; 
                newSize = 3;
                patterns = patterns3;
            }

            let xx = 0, yy = 0;

            for(let y = 0; y < input.length; y += size)
            {
                xx = 0;

                for(let x = 0; x < input.length; x += size)
                {
                    let key = makeKey(input, x, y, size);
                    let match = patterns[key];
                    if (match === undefined)
                        throw "Didn't find a match!";
                    
                    for(let yo = 0; yo < newSize; yo++)
                        for (let xo = 0; xo < newSize; xo++)
                            set(output, xx + xo, yy + yo, match[yo][xo]);
                    xx += newSize;
                }

                yy += newSize;
            }

            //dump(output);
        }

        return output;
    }

    function keyToArray(data)
    {
        let result = data.split('/');
        for(let i = 0; i < result.length; i++)
            result[i] = result[i].split('');
        return result;
    }

    function arrayToKey(data)
    {
        if (data.length === 3)
            return [data[0].join(''), data[1].join(''), data[2].join('')].join('/');
        else if (data.length === 2)
           return [data[0].join(''), data[1].join('')].join('/');
        else    
            throw "Invalid size";
    }

    function rotate(a)
    {
        if (a.length === 3)        
            return [
                [ a[2][0], a[1][0], a[0][0] ],
                [ a[2][1], a[1][1], a[0][1] ],
                [ a[2][2], a[1][2], a[0][2] ]
            ];
        else if (a.length === 2)
            return [
                [ a[1][0], a[0][0] ],
                [ a[1][1], a[0][1] ]
            ];
        else   
            throw "Invalid size";
    }

    function flipHorizontal(a)
    {
        if (a.length === 3)
            return [
                [ a[0][2], a[0][1], a[0][0] ],
                [ a[1][2], a[1][1], a[1][0] ],
                [ a[2][2], a[2][1], a[2][0] ]
            ];
        else if (a.length === 2)
            return [ 
                [ a[0][1], a[0][0] ],
                [ a[1][1], a[1][0] ]
            ];
        else
            throw "Invalid size";
    }

    function flipVertical(a)
    {
        if (a.length === 3)
            return [ a[2], a[1], a[0] ]; 
        else if (a.length === 2)
            return [ a[1], a[0] ]; 
        else    
            throw "Invalid size";
    }

    function processLine(line)
    {
        function set(patterns, key, value, force)
        {
            let old = patterns[key];
            if (old === undefined || force === true)
                patterns[key] = value;
            else
                console.log(key + " already defined");
        }

        let data = line.split('=>');
        let pattern = data[0].trim();
        let result  = keyToArray(data[1].trim());
        let array   = keyToArray(pattern);

        let keys = [];
        let a;

        keys.push(flipVertical(array));
        keys.push(flipHorizontal(array));

        for(let i = 0; i < 3; i++)
        {
            array = rotate(array);
            keys.push(array);
            keys.push(flipVertical(array));
            keys.push(flipHorizontal(array));
        }

        let destin = (result.length === 4) ? patterns4 : patterns3;

        let visited = {};

        set(destin, pattern, result, true) ;
        visited[pattern] = 1;

        for(let i=0; i<keys.length; i++)
        {
            let k = arrayToKey(keys[i]);
            if (visited[k] === undefined)
            {
                visited[k] = 1;
                set(destin, arrayToKey(keys[i]), result);
            }
        }
    }
};