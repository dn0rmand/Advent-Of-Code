module.exports = function()
{
    const assert = require('assert');

    const weapons = [
        { cost:  8, damage:4, armor:0 }, // Dagger
        { cost: 10, damage:5, armor:0 }, // Shortsword
        { cost: 25, damage:6, armor:0 }, // Warhammer 
        { cost: 40, damage:7, armor:0 }, // Longsword 
        { cost: 74, damage:8, armor:0 }, // Greataxe  
    ];

    const armors = [
        { cost: 13, damage:0, armor:1 }, // Leather
        { cost: 31, damage:0, armor:2 }, // Chainmail
        { cost: 53, damage:0, armor:3 }, // Splintmail
        { cost: 75, damage:0, armor:4 }, // Bandedmail
        { cost:102, damage:0, armor:5 }, // Platemail
    ];

    const rings = [
        { cost: 25, damage:1, armor:0 }, 
        { cost: 50, damage:2, armor:0 }, 
        { cost:100, damage:3, armor:0 }, 
        { cost: 20, damage:0, armor:1 }, 
        { cost: 40, damage:0, armor:2 }, 
        { cost: 80, damage:0, armor:3 }, 
    ];

    var configurations = getConfigurations();
    var configKeys = Object.keys(configurations).sort( function(k1, k2) {
        var c1 = configurations[k1];
        var c2 = configurations[k2];
        return c1.cost - c2.cost;
    });

    var cheapest = findCheapestWin();

    console.log("Cheapest winning configuration cost " + cheapest);

    var expensive = findMostExpensiveLost();

    console.log("Most expensive loosing configuration cost " + expensive);

    process.exit(0);

    function findCheapestWin()
    {
        for(var i = 0 ; i < configKeys.length ; i++)
        {
            var k = configKeys[i];
            var c = configurations[k];
            if (isWinningConfiguration(c)) 
                return c.cost;
        }

        return -1;
    }

    function findMostExpensiveLost()
    {
        for(var i = configKeys.length; i > 0 ; i--)
        {
            var k = configKeys[i-1];
            var c = configurations[k];
            if (!isWinningConfiguration(c)) 
                return c.cost;
        }

        return -1;
    }

    function isWinningConfiguration(c)
    {
        var boss = {
            points: 103,
            damage: 9,
            armor: 2
        } ;

        var player = {
            points: 100,
            damage: c.damage,
            armor: c.armor
        } ;

        var turn = 0;
        while (boss.points > 0 && player.points > 0)
        {
            if (turn == 0)
            {
                turn = 1;
                // Player's turn
                var x = player.damage - boss.armor;
                if (x < 1)
                    x = 1;
                boss.points -= x;
            }
            else
            {
                turn = 0;
                // Boss turn
                var x = boss.damage - player.armor;
                if (x < 1)
                    x = 1;
                player.points -= x;
            }
        }
        return player.points > 0;
    }

    function getConfigurations()
    {
        var configurations = {} ;

        function createConfiguration(w, a, r1, r2)
        {
            var ww = weapons[w];
            var c = { cost:ww.cost, damage:ww.damage, armor: 0};

            if (a !== undefined) {
                assert(armors[a] !== undefined);
                var aa = armors[a];
                c.cost += aa.cost;
                c.armor+= aa.armor;
            }
            if (r1 !== undefined) {
                var rr1 = rings[r1];
                c.cost += rr1.cost;
                c.damage += rr1.damage;
                c.armor += rr1.armor;
            }
            if (r2 !== undefined) {
                var rr2 = rings[r2];
                c.cost += rr2.cost;
                c.damage += rr2.damage;
                c.armor += rr2.armor;
            }

            var k = c.cost + "-" + c.damage + "-" + c.armor;

            configurations[k] = c;
        }

        for(var w = 0; w < weapons.length; w++)
        {
            createConfiguration(w) ;
            for(var a = 0; a < armors.length; a++)
            {                
                createConfiguration(w, a);
                for(var r1 = 0; r1 < rings.length; r1++)
                {
                    createConfiguration(w, a, r1);
                    for(var r2 = 0; r2 < rings.length; r2++)
                        if (r2 != r1)
                            createConfiguration(w, a, r1, r2);
                }
            }

            for(var r1 = 0; r1 < rings.length; r1++)
            {
                createConfiguration(w, undefined, r1);
                for(var r2 = 0; r2 < rings.length; r2++)
                    if (r2 != r1)
                        createConfiguration(w, undefined, r1, r2);
            }            
        }

        return configurations;
    }
}