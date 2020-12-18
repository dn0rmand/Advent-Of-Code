const assert = require('assert');

const DAY = +(__filename.match(/^.*\/day(\d*)\.js$/)[1]);

function loadData()
{
    const readFile = require("advent_tools/readfile");

    const entries = [];

    for(const line of readFile(__filename))
    {
        entries.push(line);
    }

    return entries;
}

function evaluate(line, part2 = false, start = 0, end = 0)
{
    let position = start || 0;
    let length   = end || line.length;

    function getExpression()
    {
        while (position < length)
        {
            if (line[position] === ' ') 
            {
                position++;
            } 
            else if (line[position] === '(') 
            {
                position++;
                // let value = '';
                let opened = 1;
                start = position;

                while (position < length)
                {
                    const c = line[position++];
                    if (c === '(') 
                    {
                        opened++;
                    } 
                    else if (c === ')') 
                    {
                        opened--;
                        if (opened === 0) 
                        {
                            end = position-1;
                            break;
                        }
                    }
                    // value += c;
                }
                if (opened !== 0) 
                {
                    throw ") expected";
                }

                value = evaluate(line, part2, start, end);
                if (typeof(value) !== "number")
                    throw "ERROR";
                return value;
            } 
            else if (line[position] >= '0' && line[position] <= '9') 
            {
                let value = 0;
                while (position < length && line[position] >= '0' && line[position] <= '9')
                {
                    value = value*10 + +(line[position++]);
                }
                return value;
            }
            else
            {
                throw "Expression expected";
            }
        }

        throw "Expression expected";
    }

    function getOperator()
    {
        while (position < length) 
        {
            if (line[position] === ' ') 
            {
                position++;
            } 
            else if (line[position] === '+' || line[position] === '*') 
            {
                return line[position++];
            }
            else
            {
                throw "+ or * expected";
            }
        }
    }

    let total = getExpression();
    let operator = getOperator();

    while (operator)
    {
        if (operator !== '+' && operator !== '*')
        {
            throw "Invalid operator";
        }

        let exp2 = getExpression();
        let op2 = getOperator();

        if (part2)
        {
            while (op2 === '+') {
                exp2 += getExpression();
                op2 = getOperator();
            }
        }

        if (operator === '+')
            total += exp2;
        else
            total *= exp2;

        operator = op2;
    }

    return total;
}

function part1(input)
{
    const answer = input.reduce((a, v) => a + evaluate(v), 0);

    return answer;
}

function part2(input)
{
    const answer = input.reduce((a, v) => a + evaluate(v, true), 0);

    return answer;
}

console.log(`--- Advent of Code day ${DAY} ---`);

const input = loadData();

assert.strictEqual(evaluate('2 * 3 + (4 * 5)'), 26);
assert.strictEqual(evaluate('5 + (8 * 3 + 9 + 3 * 4 * 3)'), 437);
assert.strictEqual(evaluate('5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))'), 12240);
assert.strictEqual(evaluate('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2'), 13632);

console.time('part-1');
console.log(`Part 1: ${part1(input)}`);
console.timeLog('part-1', `to execute part 1 of day ${DAY}`);

assert.strictEqual(evaluate('2 * 3 + (4 * 5)', true), 46);
assert.strictEqual(evaluate('5 + (8 * 3 + 9 + 3 * 4 * 3)', true), 1445);
assert.strictEqual(evaluate('5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))', true), 669060);
assert.strictEqual(evaluate('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2', true), 23340);

console.time('part-2');
console.log(`Part 2: ${part2(input)}`);
console.timeLog('part-2', `to execute part 2 of day ${DAY}`);
