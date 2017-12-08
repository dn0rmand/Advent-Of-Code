module.exports = function()
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

    // Solve Part 1
    function solve1()
    {
        if (roots.length > 1)
            throw "More than one root!";
        else if (roots.length < 1)
            throw "No roots!";
        
        return roots[0];
    }   
    
    // Solve Part 2
    function solve2(root)
    {
        calculateWeight(root);
        let badProgram = findUnbalanced(root);
        return badProgram.expectedWeigth;
    }

    let tower = {};
    let roots = []; // Should end with only one item in it.

    function getProgram(name)
    {
        let program = tower[name];
        if (program === undefined)
        {
            program = { name: name, subTowers: [] };
            tower[name] = program;
        }
        return program;
    }

    function calculateWeight(program)
    {
        let weight = program.weight;
        program.subTowers.forEach(child =>
        {
            weight += calculateWeight( child );
        });
        program.totalWeight = weight;
        return weight;
    }

    function checkIfBalanced(program)
    {
        if (program.balanced !== undefined)
            return program.balanced;

        let parent = program.parent;
        if (parent === undefined || parent.subTowers.length == 1)
        {
            program.balanced = true;
            return true;
        }

        // Check if at least one other sibling has the same total weight

        let refWeight;

        for(let i = 0; i < parent.subTowers.length; i++)
        {
            let child = parent.subTowers[i];
            if (child === program) continue;
            if (child.totalWeight === program.totalWeight)
            {
                program.balanced = true;
                return true;
            }
            else
                refWeight = child.totalWeight;           
        }

        if (parent.subTowers.length > 2) // More than 2 programs, must be not balanced
        {
            program.balanced = false;
            program.expectedWeigth = (program.weight - program.totalWeight + refWeight);
        }
        else
            program.balanced = true;

        // Don't know, check the subTowers

        for(let i = 0; i < program.subTowers.length; i++)
        {
            if (! checkIfBalanced(program.subTowers[i]))
            {
                program.balanced = false;
                return false;
            }
        }

        return program.balanced;
    }

    function findUnbalanced(root)
    {
        for(let i = 0; i < root.subTowers.length; i++)
        {
            let child = root.subTowers[i];
            if (! checkIfBalanced(child))
            {
                let unbalanced = findUnbalanced(child);
                if (unbalanced !== undefined)
                    return unbalanced;
                else
                    return child; 
            }
        }
        return undefined;
    }    

    //
    // Parse input line and build tree as we go
    //
    function processLine(line)
    {
        let parse = new parser(line);

        let program = getProgram(parse.getToken())

        parse.expectOperator('(');
        program.weight = parse.getNumber();
        parse.expectOperator(')');

        if (! parse.endOfLine())
        {
            parse.expectOperator('-');
            parse.expectOperator('>');

            let child = getProgram(parse.getToken());
            child.parent = program;
            program.subTowers.push( child ) ;

            while (! parse.endOfLine())
            {
                parse.expectOperator(',');

                let child = getProgram(parse.getToken());

                child.parent = program;
                program.subTowers.push(child);
            }            
        }   
        
        if (program.parent === undefined)
        {
            // Add to list of possible roots
            roots.push(program);
        }
        else
        {
            // remove non-root items
            roots = roots.filter(r => r.parent === undefined);
        }
    }
}
