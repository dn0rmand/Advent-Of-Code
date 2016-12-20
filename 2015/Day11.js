module.exports = function()
{
    const assert = require('assert');
    const consoleControl = require('console-control-strings')    
    
    const oldPassword = 'hxbxwxba';

    // console.log('hijklmmn (false): ' + isValid('hijklmmn'));
    // console.log('abbceffg (false): ' + isValid('abbceffg'));
    // console.log('abbcegjk (false): ' + isValid('abbcegjk'));
    // console.log('abcdffaa (true) : ' + isValid('abcdffaa'));
    // console.log('ghjaabcc (true) : ' + isValid('ghjaabcc'));
    // console.log('abcdeggg (false): ' + isValid('abcdeggg'));

    // var pwd = findNewPassword('abcdefgh');
    // assert(pwd == 'abcdffaa', 'next password of abcdefgh should be abcdffaa');

    // var pwd1 = findNewPassword('ghijklmn');
    // assert(pwd1 == 'ghjaabcc', 'next password of ghijklmn should be ghjaabcc');

    
    console.log("Caculating new password for " + oldPassword);
    var pass = findNewPassword(oldPassword);
    console.log(oldPassword + " -> " + pass);
    console.log("Caculating new password for " + pass);
    var pass2 = findNewPassword(pass);
    console.log(pass + " -> " + pass2);
    process.exit(0);

    function convertToArray(pwd)
    {
        var n = [];

        for(var i = 0; i < pwd.length; i++)
            n.push(pwd[i]);

        return n;
    }

    function nextChar(c)
    {
        var code = c.charCodeAt(0);
        return String.fromCharCode(code + 1);
    }

    function incrementPassword(password)
    {
        var i = password.length;

        while (i-- > 0)
        {
            var c = password[i];

            if (password[i] == 'z')
                password[i] = 'a';
            else
            {
                password[i] = nextChar(c);
                break;
            }
        }
    }

    function isValid(password)
    {
        var hasStraight = false;
        var pairs = { };
        var pairsCount = 0;

        for(var i = 0; i < password.length; i++)
        {
            var c = password[i];

            if (c == 'i' || c == 'o' || c == 'l')
                return false;
            
            if (!hasStraight && i < password.length-2)
            {
                var c2 = password[i+1];
                var c3 = password[i+2];
                if (c2 == nextChar(c) && c3 == nextChar(c2))
                    hasStraight = true;
            }

            if (pairsCount < 2 && pairs[c] === undefined && c == password[i+1])
            {
                pairs[c] = 1;
                pairsCount++;
                for(var j = i+2; j < password.length-1 ; j++)
                {
                    if (password[j] == c && password[j+1] == c)
                    {
                        pairsCount++;
                        break;
                    }
                }
            }
        }

        if (! hasStraight)
            return false;

        if (pairsCount < 2)
            return false;

        return true;
    }

    function findNewPassword(password)
    {
        password = convertToArray(password);

        incrementPassword(password);

        process.stdout.write(consoleControl.hideCursor());

        var count = 0;

        while(! isValid(password))
        {
            incrementPassword(password);
            if (count == 0)
            {
                process.stdout.write('\r');
                for(var i = 0; i < password.length; i++) 
                    process.stdout.write(password[i]);            
            }
            count = (count + 1) % 1000;
        }

        process.stdout.write(consoleControl.showCursor());
        console.log('');
        return password.join('');
    }
}