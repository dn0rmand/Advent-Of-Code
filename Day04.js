const fs = require('fs');
const readline = require('readline');

const readInput = readline.createInterface({
  input: fs.createReadStream('Data/Day04.data')
});

var sectorSum = 0;

readInput
.on('line', (room) => { processRoom(room); })
.on('close', () => {
    console.log("Done ... Result is " + sectorSum);
    process.exit(0);
});

function processRoom(room)
{
    var letters = { };
    var name    = "";
    var sector  = 0;
    var hash    = "";
    var state   = 1;

    // Name
    for(var i = 0; i < room.length; i++)
    {
        var c = room[i];
        switch (state)
        {
            case 1: // Name
                if (c >= 'a' && c <= 'z')
                {
                    letters[c] = (letters[c] || 0) + 1;
                    name += c;
                }
                else if (c != '-')
                {
                    i--;
                    state = 2;
                }
                else
                    name += ' ';
                break;
            case 2: // Sector
                if (c >= '0' && c <= '9')
                {
                    sector = sector*10 + (+c);
                }
                else if (c == '[')
                    state = 3;
                break;
            case 3: // hash
                if (c >= 'a' && c <= 'z')
                    hash += c;
                break
        }
    }

    var result = Object.keys(letters).sort(function(a, b) {
        var x = letters[b] - letters[a];
        if (x == 0)
            return a == b ? 0 : a > b ? 1 : -1;
        else
            return x;
    });

    var real = true;
    for(var i = 0; i < hash.length && real ; i++)
        if (hash[i] != result[i])
            real = false;

    if (real) {
        sectorSum += sector;
        name = decryptName(name, sector);
        if (name.indexOf("northpole") >= 0)
            console.log(name + ' - ' + sector);
    }
}

function decryptName(name, count)
{
    var newName = '';
    var first = 'a'.charCodeAt(0);

    for(var i = 0; i < name.length; i++)
    {
        var c = name.charCodeAt(i);
        if (c != 32)
        {
            c = first + ( (c-first+count) % 26 );
            newName += String.fromCharCode(c);
        }
        else
            newName += ' ';
    }
    return newName;
}