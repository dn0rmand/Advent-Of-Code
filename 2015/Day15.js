module.exports = function() 
{
    const assert    = require('assert');
    const fs        = require('fs');
    const readline  = require('readline');
    const parser    = require('../parser.js');

    const readInput = readline.createInterface({
        input: fs.createReadStream('2015/Data/Day15.data')
    });

    readInput
    .on('line', (line) => { 
        parseInput(line.toLowerCase());
    })
    .on('close', () => {
        // ingredients = [];
        // ingredients.push({
        //     name: "B", capacity:-1, durability:-2, flavor:6, texture:3, calories:8
        // });

        // ingredients.push({
        //     name: "C",  capacity:2, durability:3, flavor:-2, texture:-1, calories:3
        // });

        console.log("Done loading data.")
        possibleSpoonSizes(totalTeaSpoons, ingredients.length, []);
        console.log("\r" + sizeCount + " possible spoon sizes");
        calculateIngredientOrder();
        var maxScore = calculateMaxScore();
        console.log("Maximum Score is " + maxScore);
        var maxScore = calculateMaxScore(true);
        console.log("Maximum Score for 500 calories is " + maxScore);
        process.exit(0);
    });

    const totalTeaSpoons = 100;
    
    var ingredients = [];
    var ingredientsOrder = [];
    var spoonSizes = {}
    var sizeCount = 0;

    function possibleSpoonSizes(total, count, spoon)
    {
        if (total < 1)
            return; // No good

        if (count == 1)
        {
            spoon.push(total);

            var k = spoon.join('_');
            if (spoonSizes[k] === undefined)
            {
                spoonSizes[k] = 0;
                sizeCount++;
                process.stdout.write('\r'+sizeCount);                            
            }

            spoon.pop();
        }
        else
        {
            for(var i = 1; i <= total; i++)
            {
                spoon.push(i);
                possibleSpoonSizes(total-i, count-1, spoon);
                spoon.pop();
            }
        }
    }

    function calculateIngredientOrder()
    {
        function subCalculate(items, ingredient, keys)
        {
            items.push(ingredient);
            if (items.length == ingredients.length) {
                ingredientsOrder.push([].concat(items));
            }
            else
            {
                keys[ingredient.name] = 1;
                for(var i = 0 ; i < ingredients.length ; i++)
                {
                    var n = ingredients[i].name;
                    if (keys[n] === undefined)
                    {
                        subCalculate(items, ingredients[i], keys);
                    }
                }
                keys[ingredient.name] = undefined;
            }
            items.pop();
        }

        for(var i = 0 ; i < ingredients.length ; i++)
        {
            var i = ingredients[i];
            var k = { };
            subCalculate([], i, k);
        }
    }

    function calculateMaxScore(checkCalories)
    {
        var maxScore = 0;

        for(var i = 0; i < ingredientsOrder.length; i++)
        {
            var items = ingredientsOrder[i];

            var keys = Object.keys(spoonSizes);
            for(var s = 0; s < keys.length; s++)
            {
                var k = keys[s].split('_');
                assert(k.length == ingredients.length);

                var capacity = 0, durability = 0, flavor = 0, texture = 0, calories = 0;

                for(var j = 0 ; j < ingredients.length; j++)
                {
                    var spoon = +(k[j]);
                    var ingredient  = items[j];

                    capacity += (ingredient.capacity * spoon);
                    durability += (ingredient.durability * spoon);
                    flavor += (ingredient.flavor * spoon);
                    texture += (ingredient.texture * spoon);
                    calories += (ingredient.calories * spoon);
                }

                var total = Math.max(capacity, 0) * Math.max(durability, 0) * Math.max(flavor, 0) * Math.max(texture, 0);

                if (checkCalories !== true || calories == 500)
                    maxScore = Math.max(total, maxScore);
            }
        }

        return maxScore;
    }

    //Butterscotch: capacity -1, durability 0, flavor 5, texture 0, calories 6
    function parseInput(line)
    {
        var parse = new parser(line.toLowerCase());

        var ingredient = {};

        ingredient.name = parse.getToken();
        parse.expectOperator(':')
        parse.expectToken('capacity');
        ingredient.capacity = parse.getSignedNumber();
        parse.expectOperator(',')
        parse.expectToken('durability');
        ingredient.durability = parse.getSignedNumber();
        parse.expectOperator(',')
        parse.expectToken('flavor');
        ingredient.flavor = parse.getSignedNumber();
        parse.expectOperator(',')
        parse.expectToken('texture');
        ingredient.texture = parse.getSignedNumber();
        parse.expectOperator(',')
        parse.expectToken('calories');
        ingredient.calories = parse.getSignedNumber();

        ingredients.push(ingredient);
    }
}