//module.exports = 
(function()
{
    //#region FWK - Read file and load required modules
    const fs = require('fs');
    const readline = require('readline');
    const parser = require('../tools/parser.js');
    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day20.data')
    });

    readInput.on('line', (line) => processLine(line)).on('close', () => { dumpResult(); process.exit(0); });
    //#endregion

    let particles1 = [];
    let particles2 = [];

    function dumpResult()
    {
        particles1.sort((a, b) => {
            let sa = Math.abs(a.acceleration.x) + Math.abs(a.acceleration.y) + Math.abs(a.acceleration.z);
            let sb = Math.abs(b.acceleration.x) + Math.abs(b.acceleration.y) + Math.abs(b.acceleration.z);
            
            if (sa < sb)
                return -1;
            else if  (sa > sb)
                return 1;

            if (a.delta  < b.delta)
                return -1;
            if (a.delta > b.delta)
                return 1;
            return 0;
        });
        
        let a = particles1[0];
        let sa = Math.abs(a.acceleration.x) + Math.abs(a.acceleration.y) + Math.abs(a.acceleration.z);

        let subSet = particles1.filter( b => {
            let sb = Math.abs(b.acceleration.x) + Math.abs(b.acceleration.y) + Math.abs(b.acceleration.z);
            return sb <= sa;
        });

        console.log(p.id);

        executeStep(particles2);

        for(let i = 0; i < 1000; i++)
        {
            executeStep(particles2);
        }
        
        solve1();
        solve2();
    }

    function processLine(line)
    {
        function clone(p)
        {
            return {
                position: {
                    x: p.position.x,
                    y: p.position.y,
                    z: p.position.z
                },
                acceleration: {
                    x: p.acceleration.x,
                    y: p.acceleration.y,
                    z: p.acceleration.z
                },
                velocity: {
                    x: p.acceleration.x,
                    y: p.acceleration.y,
                    z: p.acceleration.z
                },
                distance: p.distance,
                id: p.id
            };
        }

        let parse = new parser(line);

        let particle = {
            position: { x:0, y:0, z:0},
            velocity: { x:0, y:0, z:0},
            acceleration: { x:0, y:0, z:0},
            distance:0
        }
        parse.expectToken('p');
        parse.expectOperator('=');
        parse.expectOperator('<');
        particle.position.x = parse.getSignedNumber(true);
        parse.expectOperator(',');
        particle.position.y = parse.getSignedNumber(true);
        parse.expectOperator(',');
        particle.position.z = parse.getSignedNumber(true);
        parse.expectOperator('>');
        particle.distance = Math.abs(particle.position.x) + Math.abs(particle.position.y) + Math.abs(particle.position.z);
        parse.expectOperator(',');

        parse.expectToken('v');
        parse.expectOperator('=');
        parse.expectOperator('<');
        particle.velocity.x = parse.getSignedNumber(true);
        parse.expectOperator(',');
        particle.velocity.y = parse.getSignedNumber(true);
        parse.expectOperator(',');
        particle.velocity.z = parse.getSignedNumber(true);
        parse.expectOperator('>');

        parse.expectOperator(',');

        parse.expectToken('a');
        parse.expectOperator('=');
        parse.expectOperator('<');
        particle.acceleration.x = parse.getSignedNumber(true);
        parse.expectOperator(',');
        particle.acceleration.y = parse.getSignedNumber(true);
        parse.expectOperator(',');
        particle.acceleration.z = parse.getSignedNumber(true);
        parse.expectOperator('>');

        particle.id = particles1.length;

        particles1.push(particle);
        particles2.push(clone(particle));
    }

    function solve1(particles)
    {        
        // Find closest to 0,0,0

        particles.sort((a, b) => {
            if (a.distance < b.distance)
                return -1;
            if (a.distance > b.distance)
                return 1;
            return 0;
        });

        let p = particles[0];

        console.log("Part 1: " + p.id + " (308)");
    }
    
    function solve2(particles)
    {
        let notCollided = 0;
        for(let i = 0; i < particles.length; i++)
        {
            if (particles[i].collided !== true)
                notCollided++;
        }

        console.log("Part 2: " + notCollided + " (504)");
    }

    function executeStep(particles)
    {
        let positions = {

        };

        for(let i = 0; i < particles.length; i++)
        {
            var p = particles[i];

            p.velocity.x += p.acceleration.x;
            p.velocity.y += p.acceleration.y;
            p.velocity.z += p.acceleration.z;

            p.position.x += p.velocity.x;
            p.position.y += p.velocity.y;
            p.position.z += p.velocity.z;

            let distance = Math.abs(p.position.x) + Math.abs(p.position.y) + Math.abs(p.position.z);
            p.delta = distance - p.distance;
            p.distance = distance;

            if (p.collided !== true)
            {
                let key = p.position.x + ',' + p.position.y + ', ' + p.position.z;
                let o = positions[key];
                if (o === undefined)
                    positions[key] = p;
                else
                {
                    p.collided = true;
                    o.collided = true;
                }
            }
        }
    }
})();
