
module.exports = function(input) {

    var index = 0;
    var line  = input;

    var skipSpaces = function()
    {
        while (index < line.length && (line[index] == ' ' || line[index] == '\t'))
            index++;        
    }

    var getToken = function()
    {
        var token = "";

        skipSpaces();

        while (index < line.length)
        {
            var c = line[index];
            if (c >= 'a' && c <= 'z')
            {
                index++;
                token += c;
            }
            else
                break;
        }

        return token;
    }

    var getNumber = function()
    {
        var value = 0;

        skipSpaces();
        while(index < line.length)
        {
            var c = line[index];
            if (c >= '0' && c <= '9')
            {
                index++;
                value = (value * 10) + (+c);
            }
            else
                break;
        }

        return value;
    }     

    var getSignedNumber = function()
    {
        skipSpaces();
        var sign = '+';
        if (index < line.length)
        {
            if (line[index] == '+' || line[index] == '-')
                sign = line[index++];
        }
        var value = getNumber();
        return sign == '-' ? -value : +value;
    }

    var getOperator = function()
    {
        skipSpaces();
        if (index < line.length)
        {
            var c = line[index];
            if (c >= '0' && c <= '9') // Digit
                return '';
            if (c >= 'a' && c <= 'z') // letter
                return '';
            index++;
            return c;
        }
        else
            return '';
    }

    var getValue = function()
    {
        skipSpaces();
        if (endOfLine())
            return undefined;
        var c = line[index];
        if (c >= '0' && c <= '9')
            return getNumber();
        else if (c == '-' || c == '+')
            return getSignedNumber();
        else if (c >= 'a' && c <= 'z')
            return getToken();

        return undefined;
    }

    var expect = function(value, expected)
    {
        if (value != expected)
            throw "Expected " + expected + " but got " + value;
    }

    var expectToken = function(expected)
    {
        expect(getToken(), expected);
    }

    var expectNumber = function(expected)
    {
        expect(getNumber(), expected);
    }

    var expectOperator = function(expected)
    {
        expect(getOperator(), expected);
    }

    var endOfLine = function()
    {
        skipSpaces();
        return index >= line.length;
    }

    var expectDone = function()
    {
        if (! endOfLine())
            throw "Was expecting end of line to be reached";
    }

    var peek = function()
    {
        skipSpaces();
        if (endOfLine())
            return undefined;
        else
            return line[index];
    }

    this.skipSpaces      = skipSpaces ;
    this.peek            = peek;
    this.getToken        = getToken;
    this.getNumber       = getNumber;
    this.getSignedNumber = getSignedNumber;
    this.getValue        = getValue;
    this.getOperator     = getOperator;
    this.endOfLine       = endOfLine;
    this.expectDone      = expectDone;
    this.expectToken     = expectToken;
    this.expectNumber    = expectNumber;
    this.expectOperator  = expectOperator;
};

