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
        console.log("Calulus solution");
        solve1b(particules);
        solve2b(particules);
        console.log();

        console.log("Brute force: Doing part 2 first is an optimization")
        solve2a(particules);
        solve1a(particules);  
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

    //#region Calculus Solution

    function solve1b(particles)
    {
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

        console.log("Part 1: " + result + " (308)");
    }

    function solve2b(particles)
    {
        function solveEquation(A,B,C)
        {
            function IsInteger(value)
            {
                if (value < 0)
                    return false;

                if (Math.ceil(value) !== value)
                    return false;

                return true;
            }

            if (A === 0)
            {
                if (B === 0)
                    return C === 0 ? undefined : [];

                let sol = -C/B;                
                return IsInteger(sol) ? [sol] : [];
            }

            let delta = B*B - 4*A*C;
            if (delta < 0)
                return [];

            delta = Math.sqrt(delta);
            let sol1 = (-delta - B)/(2*A);
            let sol2 = (+delta - B)/(2*A);

            let result = [];

            if (IsInteger(sol1))
                result.push(sol1);
            if (IsInteger(sol2))
                result.push(sol2);

            return result;
        }

        function collisionTime(p1, p2)
        {
            function intersect(a1, a2)
            {
                if (a1 === undefined)
                    return a2;
                if (a2 === undefined)
                    return a1;

                let a = [];

                for(let i = 0; i < a1.length; i++) 
                    for(let j = 0; j < a2.length; j++)
                        if (a1[i] === a2[j])
                            a.push(a1[i]);

                return a;
            }   

            let Ax = p1.acceleration.x - p2.acceleration.x;
            let Vx = p1.velocity.x - p2.velocity.x;
            let Px = p1.position.x - p2.position.x;

            let solutions = solveEquation(Ax, Vx+Vx+Ax, Px+Px);
            if (solutions !== undefined && solutions.length === 0) // no solutions
                return undefined;

            let Ay = p1.acceleration.y - p2.acceleration.y;
            let Vy = p1.velocity.y - p2.velocity.y;
            let Py = p1.position.y - p2.position.y;

            solutions = intersect(solutions, solveEquation(Ay, Vy+Vy+Ay, Py+Py));
            if (solutions !== undefined && solutions.length === 0)
                return undefined;

            let Az = p1.acceleration.z - p2.acceleration.z;
            let Vz = p1.velocity.z - p2.velocity.z;
            let Pz = p1.position.z - p2.position.z;

            solutions = intersect(solutions, solveEquation(Az, Vz+Vz+Az, Pz+Pz));

            if (solutions === undefined) // any time is good, so time 1 it is
                return 1;
            else if (solutions.length > 0)
                return solutions.sort()[0]; // smallest value
            else
                return undefined;
        }

        let collisions = [];
        let len = particles.length;

        // Calculate possible collisions
        for(let i = 0; i < len; i++)
        {
            let p1 = particles[i];

            for(let j = i+1; j < len; j++)
            {
                if (i === j) continue;

                let p2 = particles[j];
                    
                let time = collisionTime(p1, p2);

                if (time === undefined)
                    continue;
                
                collisions.push({ p1: p1, p2: p2, time:time });
            }
        }
        // Sort collision per time
        collisions.sort((a, b) => { return a.time - b.time; });

        for(let i = 0; i < collisions.length; i++)
        {
            let c = collisions[i];

            if (c.p1.collided !== undefined && c.p2.collided !== undefined) // both already collided so ignore
                continue;

            if (c.p1.collided === undefined && c.p2.collided === undefined) // not colliged yet, do it
            {
                c.p1.collided = c.p2.collided = c.time;
                len -= 2;
            }
            else if (c.p1.collided === c.time || c.p2.collided === c.time) // one was collided at the same time
            {
                c.p1.collided = c.p2.collided = c.time;
                len -= 1;
            }
        }

        console.log("Part 2: " + len + " (504)");
        return len;
    }

    //#endregion

    //#region Brute force solution
    function solve1a(particles)
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
    
    function solve2a(particles)
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

    let totalSteps = 0;

    function executeStep(particles)
    {
        totalSteps++;

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
                {
                    p.collided = true;
                }
            }
        }

        return notCollided;
    }
    //#endregion
}
