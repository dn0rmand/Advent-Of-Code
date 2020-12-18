module.exports = function()
{
    const DAY = +(__filename.match(/^.*\/day(\d*)\.js$/)[1]);

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

        const isValid = (min, max, count) => min <= count && count <= max;
        const countLetter = (pwd, letter) => pwd.reduce((a, l) => a + (l === letter), 0);

        const validPasswords = input.reduce((a, { password, rule: { letter, min, max }}) =>
                a + isValid(min, max, countLetter(password, letter)), 0);

        return validPasswords;
    }

    function part2()
    {
        const input = loadData();

        const validPasswords = input.reduce((valid, { password, rule: { letter, min, max }}) =>
            valid + ((password[min-1] === letter && password[max-1] !== letter) ||
                    (password[min-1] !== letter && password[max-1] === letter))
        , 0);

        return validPasswords;
    }

    console.log(`--- Advent of Code day ${DAY} ---`);

    console.time(`${DAY}-both`);

    console.log(`Part 1: ${part1()}`);
    console.log(`Part 2: ${part2()}`);

    console.timeLog(`${DAY}-both`, `to execute both parts of day ${DAY}`);
};