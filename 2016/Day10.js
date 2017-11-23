module.exports = function()
{
    const fs = require('fs');
    const readline = require('readline');
    const parser = require('./parser.js');

    const readInput1 = readline.createInterface({
    input: fs.createReadStream('Data/Day10.data')
    });

    var robots = [];
    var output = [];
    var values = [];
    var botId = -1;

    // Initializing
    readInput1
    .on('line', (line) => { 
        parseLine(line, true);
    })
    .on('close', () => {
        // Processing now

        values.forEach(function(value) {
            var bot = getBot(value.id);
            addChip(bot, value.value)
        });

        console.log('');
        if (botId >= 0)
            console.log("Bot comparing 17 and 61 is bot-" + botId);
        else
            console.log("No bots for 17 and 61 found!")
        
        var o0 = output[0];
        var o1 = output[1];
        var o2 = output[2];
        console.log("product of first 3 outputs: " + o0 * o1 * o2);
        process.exit(0);
    });

    function getBot(id)
    {
        id = +id;
        if (isNaN(id) || id < 0)
            throw "Invalid bot #" + id;
        var b = robots[id];
        if (b === undefined)
            robots[id] = b = 
            { 
                id: id, 
                chips: [],
                rules: []
            };
        
        return b;
    }

    function addChip(bot, value)
    {
        bot.chips.push(value);

        if (bot.chips.length >= 2) 
        {
            bot.rules.forEach(function (rule) 
            {
                var low  = bot.chips.shift();
                var high = bot.chips.pop();

                if (low > high)
                {
                    var l = low;
                    low = high;
                    high = l;
                }

                process.stdout.write("\rBot " + bot.id + " comparing " + low + " to " + high);
                if (low == 17 && high == 61 && botId < 0)
                    botId = bot.id;

                give(rule.low.to, rule.low.id, low);
                give(rule.high.to, rule.high.id, high);
            });
        }    
    }

    function give(to, toId, value)
    {
        if (value === undefined)
            return;

        if (to == "bot")
        {
            var b = getBot(toId);
            addChip(b, value)
        }
        else if (to == "output")
        {
            output[toId] = value;
        }
        else
            throw "Invalid destination: " + to;        
    }

    function parseLine(line, initializing)
    {
        var parse = new parser(line);

        var command = parse.getToken();

        if (command == "bot")
        {
            var bot = getBot(parse.getNumber());
            parse.expectToken("gives");
            parse.expectToken("low");
            parse.expectToken("to");
            var lowTo = parse.getToken();
            var lowToId = parse.getNumber();
            parse.expectToken("and");
            parse.expectToken("high");
            parse.expectToken("to");
            var highTo = parse.getToken();
            var highToId = parse.getNumber();

            bot.rules.push({
                low: { to: lowTo , id: lowToId },
                high:{ to: highTo, id: highToId } 
            });
        } 
        else if (command == "value")
        {
            var value = parse.getNumber();
            parse.expectToken("goes");
            parse.expectToken("to");
            parse.expectToken("bot");

            values.push({ id: parse.getNumber(), value: value });
        }
        else
            throw "Invalid command: " + command;

        // End of line expected
        parse.expectDone();
    }
}
