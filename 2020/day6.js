module.exports = function()
{
    const DAY = +(__filename.match(/^.*\/day(\d*)\.js$/)[1]);

    function loadData()
    {
        const readFile = require("advent_tools/readfile");

        const input = [];
        let group = undefined;

        for(const line of readFile(__filename))
        {
            if (line === '')
            {
                if (group !== undefined)
                {
                    group.questions = Object.keys(group.questions);
                    input.push(group);
                    group = undefined;
                }
            }
            else
            {
                if (group === undefined)
                {
                    group = {
                        questions: {},
                        persons: [],
                    };
                }

                for (const entry of line.split(' '))
                {
                    const values = entry.split('');
                    group.persons.push(values);
                    values.forEach((question) => group.questions[question] = 1);
                }
            }
        }

        if (group !== undefined)
        {
            group.questions = Object.keys(group.questions);
            input.push(group);
        }

        return input;
    }

    function part1()
    {
        const input = loadData();

        const answer = input.reduce((count, group) => count + group.questions.length, 0);

        return answer;
    }

    function part2()
    {
        const input = loadData();

        const answer = input.reduce((a, group) =>
            a + group.questions.reduce((a, question) => a + (group.persons.some((v) => !v.includes(question)) ? 0 : 1), 0)
        , 0);

        return answer;
    }

    console.log(`--- Advent of Code day ${DAY} ---`);

    console.time(`${DAY}-both`);

    console.log(`Part 1: ${part1()}`);
    console.log(`Part 2: ${part2()}`);

    console.timeLog(`${DAY}-both`, `to execute both parts of day ${DAY}`);
};