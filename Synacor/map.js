module.exports = function()
{    
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    const fs = require('fs');    
    const input = require('./input.js')();
    const output = require('./output.js')();

    let combinaisons = {

    };

    let coins = [
        "red coin",
        "shiny coin",
        "corroded coin",
        "concave coin",
        "blue coin"        
    ];

    combinaisons[coins.join(',')] = 1;

    function shuffleCoins()
    {
        do 
        {
            let c = coins ;
            coins = [];
    
            while(c.length > 0)
            {
                let i = getRandomInt(0, c.length);
                let coin = c[i];
                coins.push(coin);
                c.splice(i,1);
            }
            let key = coins.join(',');
            if (combinaisons[key] === undefined)
            {
                combinaisons[key] = 1;
                break;
            }
            console.log(key + ' already tried');
        }
        while (1);
    }

    const ROOM       = 1;
    const OBJECTS    = 2;
    const EXITS      = 3;
    const INVENTORY  = 4;
    const NONE       = 0;

    let $map = {
        rooms: {},
        currentId: 0,
        ids: {}
    };

    let history      = [];
    let rooms        = {};
    let status       = NONE;
    let currentRoom  = null;
    let lastRoom     = 0;
    let previousRoom = 0;
    let lastDirection= null;

    const MAP_FILE_PATH = 'data/map.json';
    const HISTORY_FILE_PATH = 'data/history.json';

    function loadHistory()
    {
        if (fs.existsSync(HISTORY_FILE_PATH))
        {
            let h = fs.readFileSync(HISTORY_FILE_PATH);
            h = JSON.parse(h);    
            for(let i = 0; i < h.history.length; i++) 
                input.addCommand(h.history[i]);   
        }
    }
    
    function saveHistory()
    {
        fs.writeFileSync(HISTORY_FILE_PATH, JSON.stringify({ history: history }));        
    }

    function cleanUpMap()
    {
        let modified = true;
        let needSaving = false;

        while (modified)
        {
            modified = false;
            for(let i = 1; i <= $map.currentId; i++)
            {
                let room  = $map.rooms[i];
                if (room.deadEnd === true)
                    continue;

                let isDead = true;
                let exits = Object.keys($map.rooms[i].exits);
                for (let e = 0; e < exits.length; e++)
                {
                    let k = room.exits[exits[e]];
                    if (k === 0)
                    {
                        isDead = false;
                        break;
                    }
                    let r = $map.rooms[k];
                    if (r.deadEnd !== true)
                    {
                        isDead = false;
                        break;
                    }
                }
                if (isDead)
                {
                    room.deadEnd = true;
                    modified = true;
                    needSaving = true;
                }
            }        
        }

        return needSaving;
    }

    function saveMap() {
        cleanUpMap();

        let ids = $map.ids;
        $map.ids = 'not JSON compatible';
        // Save map before exiting!!!!
        fs.writeFileSync(MAP_FILE_PATH, JSON.stringify($map));        
        $map.ids = ids;
    }

    function loadMap() {
        let map = undefined;

        if (fs.existsSync(MAP_FILE_PATH))
        {
            let json = fs.readFileSync(MAP_FILE_PATH);    

            map  = JSON.parse(json);

            // Build list of ids
                        
            let rooms = Object.keys(map.rooms);
            let ids   = {};
            for(let i = 0; i < rooms.length; i++)
            {
                let r = map.rooms[rooms[i]];
                let k = r.name + ' : ' + r.description;
                ids[k] = r.id;
            }
            map.ids = ids;
        }

        if (map === undefined)
        {
            input.addCommand('go south');
            input.addCommand('go north');
            input.addCommand('take tablet');
            input.addCommand('use tablet');
            input.addCommand('go doorway');
            input.addCommand('go north');
            input.addCommand('go north');
            input.addCommand('go bridge');
            input.addCommand('go continue');
            input.addCommand('go down');
            input.addCommand('go east');
            input.addCommand('take empty lantern');
            input.addCommand('go west');
            input.addCommand('go west');
            input.addCommand('go passage');
            input.addCommand('go ladder');        
        }
        else
            $map = map;

        if (cleanUpMap())
            saveMap();
    }

    function trace(message) {
        console.debug('## ' + message);
    }

    let $exit = process.exit;

    process.exit = function(code) {
        if (lastRoom > 0)
        {
            let r = $map.rooms[lastRoom];
            r.deadEnd = true;
        }
        saveMap();
    
        $exit(code);
    }

    function makeId(name, description)
    {
        let key = name + ' : ' + description;
        let id = $map.ids[key];
        if (id === undefined)
        {
            id = $map.ids[key] = ++($map.currentId);
        }
        return id;
    }

    function getNextDirection()
    {
        let current = $map.rooms[lastRoom];
        if (current === undefined)
            throw "In a room that doesn't exist";

        // Find not used direction

        let exits = Object.keys(current.exits);
        
        if (exits.length === 0) // No exits???
            throw "Dead end ... no exit";
        let defaultExit = null;
        let possibleExits = [];

        for(let i = 0; i < exits.length; i++)
        {
            let exit = exits[i];
            let destination = current.exits[exit];

            if (destination === 0)
            {
                defaultExit = exits[i];
                break;
            }
            else
            {
                let room = $map.rooms[destination];
                if (room.deadEnd !== true)
                    possibleExits.push(exit)
            }
        }
        if (defaultExit == null) // all visited so pick a random one
        {
            if (possibleExits.length === 0)
                possibleExits = exits; // Use all ?
            
            let x = getRandomInt(0, possibleExits.length);
            defaultExit = possibleExits[x];
        }
        
        return defaultExit;
    }

    function read(callback)
    {        
        if (currentRoom != null)
        {
            let current = currentRoom;
            currentRoom = null;
            current.id = makeId(current.name, current.description);

            previousRoom = lastRoom;
            lastRoom     = current.id;

            if (lastDirection != null && previousRoom > 0)
            {
                let p = $map.rooms[previousRoom];
                p.exits[lastDirection] = lastRoom;
                lastDirection = null;
            }

            let old = $map.rooms[current.id];
            if (old !== undefined)
            {
                trace("Already visited");
                let exits1 = Object.keys(old.exits);
                let exits2 = Object.keys(current.exits)
                if (exits1.length !== exits2.length)
                    trace('Not same amount of exits !!!');
                else
                {
                    let same = true;
                    for(let i = 0; same && i < exits1.length; i++)
                    {
                        let k = exits1[i];
                        let x = current.exits[k];
                        if (x === undefined)
                            same = false;
                    }
                    for(let i = 0; same && i < exits2.length; i++)
                    {
                        let k = exits2[i];
                        let x = old.exits[k];
                        if (x === undefined)
                            same = false;
                    }
                    if (! same)
                        trace('Not the same list of exits');
                }
            }
            else
            {
                $map.rooms[current.id] = current;
            }
        }
        status = NONE;

        // if (! input.hasInput())
        // {
        //     let direction = getNextDirection();
        //     input.addCommand('go ' + direction);
        // }

        input.read(callback);
    }
    
    input.didRead = function(command)
    {
        console.log('>'+command);
        if (command.startsWith('go '))
        {
            lastDirection = command.substring(3).trim();
            history.push(command);
        }
        else
        {
            switch (command)
            {
                case 'use coins':
                    coins.forEach(c => { input.addCommand('use ' + c)});
                    break;
                case 'take coins':
                    coins.forEach(c => { input.addCommand('take ' + c)});
                    shuffleCoins();
                    input.addCommand('use coins');
                    break;
                case 'save history':
                    saveHistory();
                    break;
                case 'save map':
                    saveMap();
                    break;
                case 'halt':
                    process.exit(0);
                    break;
                default:
                    history.push(command);
                    break;
            }
        }
    }

    output.didPrint = function(output)
    {
        console.log(output);

        if (output === '')
        {
            status = NONE;
        }
        else if (output === 'As you place the last coin, they are all released onto the floor.')
        {
            // retake all the coins
            input.addCommand('take coins');
        }
        else if (output.startsWith('=='))
        {
            let name = output.replace(/==/g, '').trim();
            status = ROOM;
            currentRoom = {
                name: name,
                description: '',                
                exits: {}
            };
        }
        else if (output === 'Your inventory:')
        {
            status = INVENTORY;
        }
        else if (output === 'Things of interest here:')
        {
            status = OBJECTS;
        }
        else if (output.match(/There (is|are) \d+ exits?:/g))
        {
            status = EXITS;
        }
        else if (output.startsWith('- '))
        {
            switch (status)
            {
                case OBJECTS:
                    if (currentRoom == null)
                        throw "Current Room not set!";

                    if (currentRoom.objects === undefined)
                        currentRoom.objects = [];
                    let object = output.substring(2).trim();
                    currentRoom.objects.push(object);
                    break;
                case EXITS:
                    if (currentRoom == null)
                        throw "Current Room not set!";
                    let exit = output.substring(2).trim();
                    currentRoom.exits[exit] = 0;
                    break;
            }
        }
        else if (status === ROOM)
        {
            currentRoom.description = output;
        }
    }

    loadMap();
    loadHistory();

    return {
        read: read,
        print: output.print
    };
}
