module.exports = function() 
{
    const assert    = require('assert');
    const fs        = require('fs');
    const readline  = require('readline');
    const parser    = require('../parser.js');

    const readInput = readline.createInterface({
        input: fs.createReadStream('2015/Data/Day14.data')
    });

    readInput
    .on('line', (line) => { 
        parseInput(line.toLowerCase());
    })
    .on('close', () => {
        calculate();
        var winner = deer[0];
        console.log("Winner is " + winner.name + " with a distance of " + winner.distance);
        calculate2();
        var winner = deer[0];
        console.log("Winner is " + winner.name + " with " + winner.points + " points");
        process.exit(0);
    });

    const totalTime = 2503;

    var deer = [];

    function calculate2()
    {
        for(var i = 0; i < deer.length; i++)
        {
            deer[i].rest = 0;
            deer[i].run  = 0;
            deer[i].distance = 0;
            deer[i].points = 0;
        }

        for(var time = 0; time < totalTime; time++)
        {
            for(var i = 0; i < deer.length; i++)
            {
                var d = deer[i];

                if (d.rest == 0)
                {
                    d.distance += d.speed;
                    d.run++;
                    if (d.run >= d.flyTime)
                    {
                        d.run = 0;
                        d.rest= d.restTime;
                    }
                }
                else
                    d.rest--;
            }            
            deer.sort((d1, d2) => {
                return d2.distance - d1.distance;
            });
            deer[0].points++;
            for(var i = 1; i < deer.length; i++)
                if (deer[i].distance == deer[0].distance)
                    deer[i].points++;
                else
                    break;
        }

        deer.sort((d1, d2) => {
            return d2.points - d1.points;
        })
    }
    
    function calculate()
    {
        for(var i = 0; i < deer.length; i++)
        {
            var d = deer[i];

            var time = totalTime;
            var distance = 0;

            while (time > 0)
            {
                var t = Math.min(d.flyTime, time);
                distance += (t * d.speed);

                time -= d.flyTime;
                time -= d.restTime;
            }

            d.distance = distance;
        }

        deer.sort((d1, d2) => {
            return d2.distance - d1.distance;
        })
    }

    function parseInput(line)
    {
        var parse = new parser(line.toLowerCase());

        var name = parse.getToken();
        parse.expectToken('can');
        parse.expectToken('fly');
        var speed = parse.getNumber();
        parse.expectToken('km');
        parse.expectOperator('/')
        parse.expectToken('s')
        parse.expectToken('for');
        var flyTime = parse.getNumber();
        parse.expectToken('seconds');
        parse.expectOperator(',')
        parse.expectToken('but');
        parse.expectToken('then');
        parse.expectToken('must');
        parse.expectToken('rest');
        parse.expectToken('for');
        var restTime = parse.getNumber();
        parse.expectToken('seconds');
        parse.expectOperator('.');

        var d = {
            name: name,
            speed: speed,
            flyTime: flyTime,
            restTime: restTime
        }

        deer.push(d);
    }
}