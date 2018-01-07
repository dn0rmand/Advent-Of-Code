module.exports = function(input, output)
{    
    const fs = require('fs');    

    const $didPrint = output.didPrint;
    const $didRead  = input.didRead;

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    // Code to try all possible combinaison of coins

    let combinaisons = { };

    let coins = [ "red coin", "shiny coin", "corroded coin", "concave coin", "blue coin" ];

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

    let history = [];

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

    input.didRead = function(command)
    {
        $didRead(command);

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
            default:
                history.push(command);
                break;
        }
    }

    output.didPrint = function(output)
    {
        $didPrint(output);

        if (output === 'As you place the last coin, they are all released onto the floor.')
        {
            // retake all the coins
            input.addCommand('take coins');
        }
    }

    //loadHistory();
}
