const DAY = +(__filename.match(/^.*\/day(\d*)\.js$/)[1]);

function loadData()
{
    const readFile = require("advent_tools/readfile");

    const input = {
        player1: [],
        player2: [],
    };

    let ptr = undefined;
    let MAX = 0;

    for(const line of readFile(__filename))
    {
        if (line === 'Player 1:') {
            ptr = input.player1;
        } else if (line === 'Player 2:') {
            ptr = input.player2;
        }
        else if (line.trim().length > 0) {
            const value = +line.trim();
            ptr.push(value);
            MAX = Math.max(MAX, value);
        }
    }
    return input;
}

function getScore(winner)
{
    const deck = winner.reverse();
    const score = deck.reduce((a, value, index) => a + (index+1)*value, 0);

    return score;
}

function part1(player1, player2)
{
    while (player1.length && player2.length) {
        const card1 = player1.shift();
        const card2 = player2.shift();

        if (card1 > card2) {
            player1.push(card1);
            player1.push(card2);
        } else {
            player2.push(card2);
            player2.push(card1);
        }
    }

    const score = getScore(player1.length ? player1 : player2);

    return score;
}

function game(player1, player2, subGame)
{
    if (subGame)
    {
        const max1 = player1.reduce((a, v) => Math.max(a, v));
        const max2 = player2.reduce((a, v) => Math.max(a, v));

        if (max1 > max2)
        {
            // player1 always win
            return 1;
        }
    }

    let winner;

    const visited = new Set();

    while (player1.length && player2.length)
    {
        if (subGame)
        {
            const key = `${ player1.join(':') }-${ player2.join(':') }`;
            if (visited.has(key)) {
                return 1;
            }
            visited.add(key);
        }

        const card1 = player1.shift();
        const card2 = player2.shift();

        if (card1 <= player1.length && card2 <= player2.length) {
            winner = game(player1.slice(0, card1), player2.slice(0, card2), true);
        } else if (card1 > card2) {
            winner = 1;
        } else {
            winner = 2;
        }

        if (winner === 1) {
            player1.push(card1, card2);
        } else {
            player2.push(card2, card1);
        }
    }

    return player1.length ? 1 : 2;
}

function part2(player1, player2)
{
    game(player1, player2, false);

    console.log('');

    const score = getScore(player1.length ? player1 : player2);

    return score;
}

const day22 = module.exports = function()
{
    console.log(`--- Advent of Code day ${DAY} ---`);

    const { player1: player11, player2: player21 } = loadData();

    console.time(`${DAY}-part-1`);
    console.log(`Part 1: ${part1(player11, player21)}`);
    console.timeLog(`${DAY}-part-1`, `to execute part 1 of day ${DAY}`);

    const { player1: player12, player2: player22 } = loadData();

    console.time(`${DAY}-part-2`);
    console.log(`Part 2: ${part2(player12, player22)}`);
    console.timeLog(`${DAY}-part-2`, `to execute part 2 of day ${DAY}`);
};
