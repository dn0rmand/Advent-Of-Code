let rooms = 
[
    { id: 0, value: 22, links:[]}, //0
    { id: 1, value: 9,  links:[]},  //1 
    { id: 2, value: 18, links:[]}, //2
    { id: 3, value: 4,  links:[]},  //3
    { id: 4, value: 4,  links:[]},  //4
    { id: 5, value: 11, links:[]}, //5
    { id: 6, value: 8,  links:[]},  //6
    { id: 7, value: 1,  links:[]}   //7
];

let links = [
    '0-1', '0-3', '0+3', '0+4',
    '1*1', '1*2', '1-1', '1-2', '1-3',
    '2*2', '2-2', '2-3', '2-5', '2*5', '2*7',
    '3-3', '3*3', '3-5', '3+4', '3*4', '3*5', '3+3',
    '4+4', '4*4', '4*5', '4*6', 
    '5*5', '5-5', '5*7', '5-6', '5*6', '5-7',
    '6-6', '6*6', '6-7'
];

function buildLinks()
{
    links.forEach(l => {
        let left = +(l[0]);
        let right= +(l[2]);
        let sign = l[1];
        
        rooms[left].links.push({op: sign, room: right});
        if (left !== right && left != 0)
            rooms[right].links.push({op: sign, room: left});
    });

    // var json = JSON.stringify(rooms);
    // console.log(json);
    // process.exit(0);
}

let visited = {};
let shortest = 7;

function FindShortestPath(currentRoom, currentValue, path)
{
    let count = path.length;

    if (count > shortest || currentValue < 0)
        return;

    if (currentRoom == 0 && count != 0)
        return; // Invalid to go back

    if (currentRoom == 7 && currentValue == 30)
    {
        console.log(count + ' -> ' + path.join(' , '));
        shortest = count;
        return;
    }

    if (currentRoom == 7 && currentValue != 30) // Bad!
        return;

    let k = 'A' + currentRoom + "|" + currentValue;
    let v = visited[k];
    if (v === undefined)
        visited[k] = count;
    else if (v > count)
        visited[k] = count;
    else
        return; // no point going further this way

    let r = rooms[currentRoom];
    r.links.forEach(l =>
    {
        let r2 = rooms[l.room];
        let newValue;
        switch (l.op)
        {
            case '+':                
                newValue = currentValue + r2.value;
                break;
            case '-':
                newValue = currentValue - r2.value;
                break;
            case '*':
                newValue = currentValue * r2.value;
                break;
            default:
                throw 'Unknown operation';
        }
        
        path.push(currentValue + l.op + r2.value + '(' + l.room + ')=' + newValue);
        FindShortestPath(l.room, newValue, path);
        path.pop(); // remove it!
    });
}

buildLinks();
FindShortestPath(0, 22, []);
console.log('Done');