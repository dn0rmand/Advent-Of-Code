module.exports = function()
{
    const prettyHrtime = require('pretty-hrtime');
    
    //#region FWK - Read file and load required modules
    const fs = require('fs');
    const readline = require('readline');
    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day16.data')
    });

    readInput.on('line', (line) => processLine(line)).on('close', () => { dumpResult(); process.exit(0); });
    //#endregion

    let programs = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p'];
    let program2 = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p']; // Init to right size

    let dance    = [];

    function dumpResult()
    {
        let reference = programs.join('');
        executeDance2();
        console.log('Part 1: ' + programs.join('') + ' (nlciboghjmfdapek)');

        let total = 1000000000;
        let modulo;

        // Find the modulo
        for(let i = 1; i < total; i++)
        {
            executeDance();
            if (programs.join('') === reference)
            {
                modulo = i+1;
                remainder = total % modulo;
                break;
            }
        }

        //console.log('Modulo is ' + modulo + ', need to execute ' + remainder + ' more times');

        while (remainder > 0)
        {
            executeDance();
            remainder--;
        }

        console.log('Part 2: ' + programs.join('') + ' (nlciboghmkedpfja)');
    }

    function executeDance2()
    {
        let time = process.hrtime();
        for(var i = 0; i < dance.length ; i++)
            dance[i]();
        time = process.hrtime(time);
        
        // assume 0 seconds and make nanoseconds become seconds
        time[0] = time[1];
        time[1] = 0;

        let words = prettyHrtime(time, {verbose:true});
        console.log("Brute force would take " + words);
    }
    
    function executeDance()
    {
        for(var i = 0; i < dance.length ; i++)
            dance[i]();
    }

    function processLine(line)
    {
        let l = programs.length;

        line.split(',').forEach(command => {
            switch (command[0])
            {
                case 's':
                {
                    let count = +(command.substring(1));

                    let f = function() 
                    {
                        for(let i = 0; i < 16; i++)
                            program2[ ( i + count ) % 16 ] = programs[i];

                        let n = program2;
                        program2 = programs;
                        programs = n;
                    }
                    dance.push(f);
                    pCount = count;
                    break;
                }
                case 'p':
                {
                    let c1 = command[1];
                    let c2 = command[3];

                    let f = function() 
                    {
                        let p1 = programs.indexOf(c1);
                        let p2 = programs.indexOf(c2);

                        let c = programs[p1];
                        programs[p1] = programs[p2];
                        programs[p2] = c;
                    }
                    dance.push(f);
                    break;
                }
                case 'x':
                {
                    let positions = command.substring(1).split('/');
                    let p1 = +(positions[0]);
                    let p2 = +(positions[1]);

                    let f = function() 
                    {
                        let c = programs[p1];
                        programs[p1] = programs[p2];
                        programs[p2] = c;
                    }
                    dance.push(f);
                    break;
                }
            }
        });
    }
}