function loadData()
{
    const readFile = require("advent_tools/readfile");

    const entries = [];

    for(const line of readFile(__filename))
    {
        const [rule, password] = line.split(':');
        const [lengths, letter] = rule.split(' ');
        const [min, max] = lengths.split('-');

        entries.push({
            password: password.trim().split(''),
            rule: {
                min: +min,
                max: +max,
                letter: letter.trim(),
            }
        });
    }

    return entries;
}

function part1()
{
    const input = loadData();

    const validPasswords = input.reduce((valid, { password, rule: { letter, min, max }}) => {
        const count = password.reduce((a, l) => {
            a += (l === letter) ? 1 : 0;
            return a;
        }, 0);
        return valid + ((count <= max && count >= min) ? 1 : 0);
    }, 0);
    
    return validPasswords;
}

function part2()
{
    const input = loadData();

    const validPasswords = input.reduce((valid, { password, rule: { letter, min, max }}) => {
        if ((password[min-1] === letter && password[max-1] !== letter) ||
            (password[min-1] !== letter && password[max-1] === letter)) {
            return valid + 1;
        }
        else {
            return valid;
        }
    }, 0);
    
    return validPasswords;
}

console.log('--- Advent of Code day 2 ---');
console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
