const fs = require('fs')
const pretty = require('pretty-hrtime');
const https = require('https');

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
            path: '/2018/leaderboard/private/view/20724.json',
            method: 'GET',
            headers: {
                'Host': 'adventofcode.com',
                'Cookie': 'session=53616c7465645f5fc79924869e4298f96fbcec344a2ca0611c01379fb284483ed0e23b1bf5a841130f91c112f9b7d9dc',                
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
        // Read last saved file
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
            cdl['diff'] = (+(cdl[2].get_star_ts)) - (+(cdl[1].get_star_ts));
            cdl[1] = convertDate(cdl[1].get_star_ts);
            cdl[2] = convertDate(cdl[2].get_star_ts);
        }
    }
    
    return users;
}

async function printBoard()
{
    let board = await readBoard();

    let names = Object.keys(board);
    names.sort();

    for (let name of names)
    {
        let user = board[name];
        if (user.stars === 0)
            continue;

        console.group(name);
            console.log("Stars       :", user.stars);
            console.log("Last Star   :", user.last_star_ts.toLocaleString());
            console.log("Local Score :", user.local_score);
            console.log("Global Score:", user.local_score);
            for (let co of Object.keys(user.completion_day_level))
            {
                cdl = user.completion_day_level[co];

                console.log("Day " + co, 
                                "- Part 1:", cdl[1].toLocaleString(), 
                                "- Part 2:", cdl[2].toLocaleString(),
                                "- differnce:", pretty([cdl.diff, 0], {verbose:true}));
            }
        console.groupEnd();
        console.log();
    }
    process.exit(0);
}

printBoard();
