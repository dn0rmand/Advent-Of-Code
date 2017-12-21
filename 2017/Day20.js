module.exports = function()
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

    let particules = [];

    function dumpResult()
    {
        console.log("Doing part 2 first is an optimization")
        solve0(particules);
        solve2(particules);
        solve1(particules);  
    }

    function processLine(line)
    {
        let parse = new parser(line);

        let particle = {
            position: { x:0, y:0, z:0, value:0},
            velocity: { x:0, y:0, z:0, value:0},
            acceleration: { x:0, y:0, z:0, value:0},
            distance:0,
            id:0
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

        particle.acceleration.value = Distance(particle.acceleration);
        particle.distance = Distance(particle.position);

        particle.id = particules.length;

        particules.push(particle);
    }

    function Distance(a)
    {
        return Math.abs(a.x) + Math.abs(a.y) + Math.abs(a.z);        
    }

    function solve0(particles)
    {
        // pos(t) = p + vt + t* (t+1)/2 * a

        let t = 1000000; // 1 million

        let result  = -1;
        let distance= Number.MAX_VALUE;
        let tt = (t * (t+1)) / 2;

        for(let i = 0; i < particles.length; i++)
        {
            let p = particles[i];

            let x =  p.position.x + (t * p.velocity.x) + (tt * p.acceleration.x);
            let y =  p.position.y + (t * p.velocity.y) + (tt * p.acceleration.y);
            let z =  p.position.z + (t * p.velocity.z) + (tt * p.acceleration.z);

            let d = Distance({x: x, y:y, z:z});

            if (d < distance)
            {
                distance = d
                result   = p.id;
            }
        }

        console.log("Part 1: " + result + " (308) with math");
    }

    function solve1(particles)
    {        
        let compareAcceleration = (a, b) => 
        {
            return (a.acceleration.value - b.acceleration.value);
        };

        let compareDistance = (a, b) => 
        {
            return a.distance - b.distance;
        };
        
        function check(xa, xv, xp)
        {
            if (xa >= 0 && xv >= 0 && xp >= 0)
                return true;
            if (xa <= 0 && xv <= 0 && xp <= 0)
                return true;
                
            return false;            
        }

        particles.sort(compareAcceleration);

        let a  = particles[0];

        particles = particles.filter( b => 
        {
            return b.acceleration.value <= a.acceleration.value;
        });

        let steps = 0 ;

        while(true)
        {
            let o = particles.find( b => 
            {
                if (! check(b.acceleration.x, b.velocity.x, b.position.x))
                    return true;

                if (! check(b.acceleration.y, b.velocity.y, b.position.y))
                    return true;

                if (! check(b.acceleration.z, b.velocity.z, b.position.z))
                    return true;

                return false;
            });

            if (o === undefined)
                break;

            steps++;
            executeStep(particles);                              
        }

        particles.sort(compareDistance);

        console.log("Part 1: " + particles[0].id + " (308) in " + steps + " steps");
    }
    
    function solve2(particles)
    {
        let notCollided = -1;
        let count       = 0;

        for(let i = 0; i < 1000000; i++) // one million ma
        {
            let value = executeStep(particles);

            if (value === notCollided)
            {
                count++;
                if (count > 100) // didn't change for 200 iteration ... must be done
                {
                    count = i+1;
                    break;
                }
            }
            else
            {
                count       = 1;
                notCollided = value;
            }
        }
                
        console.log("Part 2: " + notCollided + " (504) in " + count + " steps");
    }

    function executeStep(particles)
    {
        let positions = { };
        let notCollided = 0;
        for(let i = 0; i < particles.length; i++)
        {
            var p = particles[i];

            p.velocity.x += p.acceleration.x;
            p.velocity.y += p.acceleration.y;
            p.velocity.z += p.acceleration.z;

            p.position.x += p.velocity.x;
            p.position.y += p.velocity.y;
            p.position.z += p.velocity.z;
            
            p.distance = Distance(p.position);

            if (p.collided !== true)
            {
                let key = p.position.x + ',' + p.position.y + ',' + p.position.z;
                let o   = positions[key];

                if (o === undefined)
                {
                    positions[key] = p;
                    notCollided++;
                }
                else if (o.collided !== true)
                {
                    o.collided = true;
                    p.collided = true;
                    notCollided--;
                }
                else
                    p.collided = true;
            }
        }

        return notCollided;
    }
}
