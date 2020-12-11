const fs = require('fs')
const pretty = require('pretty-hrtime');
const https = require('https');
const colors = require('colors');

function convertDate(ts)
{
    return new Date(1970, 0, 1, -5, 0, +ts);
}

async function getBoard()
{
    let isLive = false;

    for (let arg of process.argv)
        if (arg.toLowerCase() === "live")
            isLive = true;

    let json;

    if (isLive)
    {
        const options = {
            hostname: 'adventofcode.com',
            port: 443,
            path: '/2020/leaderboard/private/view/20724.json',
            method: 'GET',
            headers: {
                'Host': 'adventofcode.com',
                'Cookie':  'session=53616c7465645f5fdb22ca174af266c773270192cf230888cc7641843fcdb4449a2eec3f9d75e2d7f4ceee1c54a2073c',
            }
        };

        json = await new Promise((resolve, reject) => {
            https.get(options, (res) =>
            {
                if (res.statusCode !== 200)
                {
                    reject(res.statusMessage);
                    return;
                }

                res.on('data', (content) => {
                    resolve(content);
                });
                res.on('error', (e) => {
                    console.error(e);
                    reject(e);
                });
            }).on('error', (e) => {
                console.error(e);
                reject(e);
            });
        });

        fs.writeFileSync("board.json", json);
    }
    else
    {
        // use last saved file
        json = fs.readFileSync("board.json");
    }

    let board = JSON.parse(json);

    return board
}

async function readBoard()
{
    let board = await getBoard();

    let members = board.members;
    let users = {};

    for (let id of Object.keys(members))
    {
        user = members[id];
        let name = user.name || "Anonymous " + id;
        users[name] = user;
        user.last_star_ts = convertDate(user.last_star_ts);
        for (let co of Object.keys(user.completion_day_level))
        {
            cdl = user.completion_day_level[co];
            if (cdl[2] !== undefined)
            {
                cdl['diff'] = (+(cdl[2].get_star_ts)) - (+(cdl[1].get_star_ts));
                cdl[1] = convertDate(cdl[1].get_star_ts);
                cdl[2] = convertDate(cdl[2].get_star_ts);
            }
            else
                cdl[1] = convertDate(cdl[1].get_star_ts);
        }
    }

    return users;
}

async function printBoard()
{
    let board = await readBoard();

    let names = Object.keys(board);
    names.sort((a, b) => board[b].local_score - board[a].local_score);

    let position = 0;

    for (let name of names)
    {
        ++position;
        let user = board[name];
        if (user.stars === 0)
            continue;

        console.group(('#' + position).yellow.bold ,
                       '-', name.bold.white,
                       ("(" + user.local_score + (user.global_score ? `/${user.global_score})` :")")).green);
            console.log("⭐️".repeat(user.stars));
            console.log("Last ⭐️ :", user.last_star_ts.toLocaleString());
            for (let co of Object.keys(user.completion_day_level))
            {
                cdl = user.completion_day_level[co];
                if (+co < 10)
                    co = "0" + co;
                if (cdl[2] === undefined)
                    console.log("Day " + co.bold,
                                    "   :", cdl[1].toLocaleString());
                else
                    console.log("Day " + co.bold,
                                "   :", cdl[1].toLocaleString(),
                                "-", cdl[2].toLocaleString(),
                                "-", pretty([cdl.diff, 0], {verbose:true}).bold.green);
            }
        console.groupEnd();
        console.log();
    }
}

printBoard();
