const day7 = function()
{
    const fs = require('fs');
    const readline = require('readline');
    const parser = require('../tools/parser.js');

    const readInput = readline.createInterface({
        input: fs.createReadStream('Data/Day07.data')
    });

    readInput
    .on('line', (line) => { 
        processLine(line);
    })
    .on('close', () => {
        let root = solve1();
        console.log("Part 1 answer is " + root.name + " ( gmcrj )");
        let weight = solve2(root);
        console.log("Part 2 answer is " + weight + " ( 391 )");
        process.exit(0);
    });

    let towers      = {};
    let roots       = [];

    function getTower(name)
    {
        let tower = towers[name];
        if (tower === undefined)
        {
            tower = { name: name, children: [] };
            towers[name] = tower;
        }
        return tower;
    }

    function calculateWeight(tower)
    {
        let weight = tower.weight;
        tower.children.forEach(child =>
        {
            weight += calculateWeight( child );
        });
        tower.totalWeight = weight;
        return weight;
    }

    function findBadWeight(root)
    {
        // var w ;
        // var bad = -1;

        // if (root.children.length > 2)
        // {
        //     var w0 = root.children[0].totalWeight;
        //     var w1 = root.children[1].totalWeight;
        //     var w2 = root.children[2].totalWeight;
        //     if (w0 == w1)
        //         w = w0;
        //     else if (w1 == w2)
        //         w = w1;
        //     else if (w0 == w2)
        //         w = w0;
        // }

        // let result ;
        let ref = 0;
        let refGood = false;
        let badNode = undefined;

        for (let i = 0; i < root.children.length; i++)
        {
            let c = root.children[i];
            let w = c.totalWeight;

            if (i === 0)
            {
                ref = w;
                badNode = c; // In case there is only 1 child 
            }
            else if (ref !== w)
            {
                if (! refGood && i < root.children.length-1)
                {
                    let w2 = root.children[i+1].totalWeight;
                    if (w2 == ref)
                    {
                        badNode = c;
                    }
                    else // ref was bad!
                    {
                        ref = w;
                        badNode = root.children[0];
                    }
                }
                else                
                    badNode = c;
                break;
            }
            else 
                refGood = true;
        }

        if (badNode === undefined) // It all good!!!????!!!???
            return undefined;

        if (badNode.totalWeight === ref) // wasn't bad
            return undefined;

        var badChild = findBadWeight(badNode);
        if (badChild !== undefined)
            return badChild;

        badNode.expectedWeigth = badNode.weight - badNode.totalWeight + ref; 
        return badNode;
    }

    function solve2(root)
    {
        calculateWeight(root);
        var badNode = findBadWeight(root);
        return badNode.expectedWeigth;
    }

    function solve1()
    {
        if (roots.length > 1)
            throw "More than one root!";
        else if (roots.length < 1)
            throw "No roots!";
        
        return roots[0];
    }   

    //
    // Parse input line and build tree as we go
    //
    function processLine(line)
    {
        let parse = new parser(line);

        let tower = getTower(parse.getToken())

        parse.expectOperator('(');
        tower.weight = parse.getNumber();
        parse.expectOperator(')');

        if (! parse.endOfLine())
        {
            parse.expectOperator('-');
            parse.expectOperator('>');

            let child = getTower(parse.getToken());
            child.parent = tower;
            tower.children.push( child ) ;

            while (! parse.endOfLine())
            {
                parse.expectOperator(',');

                let child = getTower(parse.getToken());

                child.parent = tower;
                tower.children.push(child);
            }            
        }   
        
        if (tower.parent === undefined)
        {
            // Add to list of possible roots
            roots.push(tower);
        }
        else
        {
            // remove non-root items
            roots = roots.filter(r => r.parent === undefined);
        }
    }
}

module.exports = day7;

//day7();