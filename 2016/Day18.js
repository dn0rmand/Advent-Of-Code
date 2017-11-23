module.exports = function()
{
    const puzzleInput = '.^^^.^.^^^^^..^^^..^..^..^^..^.^.^.^^.^^....^.^...^.^^.^^.^^..^^..^.^..^^^.^^...^...^^....^^.^^^^^^^';

    var rowCount = 400000;
    var safe     = 0;

    var length  = puzzleInput.length;
    var current = puzzleInput;

    for(var i = 0; i < length; i++)
        if (current[i] == '.')
            safe++;
            
    for(var row = 1; row < rowCount; row++)
    {
        var previous = current;
        var current  = [];

        for(var i = 0; i < length; i++)
        {
            var c1 = i > 0 ? previous[i-1] : '.';
            var c2 = previous[i];
            var c3 = i < previous.length-1 ? previous[i+1] : '.';

            switch (c1+c2+c3)
            {
                case '..^': 
                case '^..': 
                case '.^^': 
                case '^^.':             
                    current[i] = '^'; 
                    break;

                // case '.^.':
                // case '^.^':
                // case '...':
                // case '^^^':
                default:
                    safe++;
                    current[i] = '.'; 
                    break;
            }
        }
    }

    console.log(safe + " safe tiles");
    process.exit(0);
}
