module.exports = function()
{
    const assert = require('assert');

    function getNextCode(code)
    {
        var newCode = (code * 252533) % 33554393;

        return newCode;
    }

    // Enter the code at row 2981, column 3075

    var row = 1, column = 1, code = 20151125;

    while (! (row == 2981 && column == 3075))
    {
        if (row == 1)
        {
            row = column+1;
            column = 1;
        }
        else
        {
            row--;
            column++;
        }
        code = getNextCode(code);
    }

    console.log("Code to enter is " + code);
    process.exit(0);
}