
module.exports = function(input) {

    let index = 0;
    let line  = input;

    let skipSpaces = function()
    {
        while (index < line.length && (line[index] == ' ' || line[index] == '\t'))
            index++;        
    }

    let getToken = function()
    {
        let token = "";

        skipSpaces();

        while (index < line.length)
        {
            let c = line[index];
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

    let getNumber = function(throwOnError)
    {
        let value = 0;
        let valid = false;

        skipSpaces();
        while(index < line.length)
        {
            let c = line[index];
            if (c >= '0' && c <= '9')
            {
                valid = true;
                index++;
                value = (value * 10) + (+c);
            }
            else
                break;
        }

        if (! valid && throwOnError == true)
            throw "Valid number expected"
        return value;
    }     

    let getSignedNumber = function(throwOnError)
    {
        skipSpaces();
        let sign = '+';
        if (index < line.length)
        {
            if (line[index] == '+' || line[index] == '-')
                sign = line[index++];
        }
        let value = getNumber(throwOnError);
        return sign == '-' ? -value : +value;
    }

    let getOperator = function()
    {
        skipSpaces();
        if (index < line.length)
        {
            let c = line[index];
            if (c >= '0' && c <= '9') // Digit
                return '';
            if (c >= 'a' && c <= 'z') // letter
                return '';
            index++;

            if (index < line.length)
            {
                let c2 = c + line[index];
                if (c2 === '!=' || c2 === '<=' || c2 === '>=' || c2 === '==')
                {
                    index++;
                    return c2;
                }
            }
            return c;
        }
        else
            return '';
    }

    let getValue = function()
    {
        skipSpaces();
        if (endOfLine())
            return undefined;
        let c = line[index];
        if (c >= '0' && c <= '9')
            return getNumber();
        else if (c == '-' || c == '+')
            return getSignedNumber();
        else if (c >= 'a' && c <= 'z')
            return getToken();

        return undefined;
    }

    let expect = function(value, expected)
    {
        if (value != expected)
            throw "Expected " + expected + " but got " + value;
    }

    let expectToken = function(expected)
    {
        expect(getToken(), expected);
    }

    let expectNumber = function(expected)
    {
        expect(getNumber(), expected);
    }

    let expectOperator = function(expected)
    {
        expect(getOperator(), expected);
    }

    let endOfLine = function()
    {
        skipSpaces();
        return index >= line.length;
    }

    let expectDone = function()
    {
        if (! endOfLine())
            throw "Was expecting end of line to be reached";
    }

    let peek = function()
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

