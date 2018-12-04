// https://hack.ainfosec.com/
// 545a62ad-1d58-4154-89c1-b5aff36edf12

function rotate(input)
{
    const A = 'a'.charCodeAt(0);
    const Z = 'z'.charCodeAt(0);

    function rot(input, value)
    {
        let r = '';
        for (let c of input)
        {
            let x = c.charCodeAt(0);
            if (x >= A && x <= Z)
                x = ((c.charCodeAt(0) - A + value) % 26) + A;
            r += String.fromCharCode(x);
        }
        return r;
    }

    let answer  = undefined;
    let english = ['you', 'that', 'this', 'the', 'your', 'loyal', 'back', 'always', 'going', 'was', 'will', 'call',
                   'wish', 'father', 'hope', 'murdered', 'drink', 'how', "it's", "want", "leave", "didn't", "eleven",
                   'failure', 'friendship', "don't", 'infinity', 'goal', 'forget', 'truth', 'gentlemen', 'money', 'armies',
                   'from', 'him', 'stomach', 'stupid', 'here', 'dead', 'beginning', 'enemies', 'houston', 'phone', 'need',
                   'baby', 'crying', 'vengeance', 'seize', 'just', 'kindness', 'another', 'pull', 'morning', "ain't",
                   'attention', 'have', 'stella', "could've", "make", 'life', 'lucky', 'adrian', 'robinson', 'what', 
                   'room'
                ];

    for (let i = 1; i < 26; i++)
    {
        let output = rot(input, i);
        let values = output.split(/[ ,.!?]/);
        let good   = false;

        for (let word of values)
        {
            if (english.includes(word))
            {
                good = true;
                break;
            }
        }

        if (good)
        {
            // console.log(output);
            // for (let r = 1; r <= i; r++)
            // {
            //     let v = values.pop();
            //     values.unshift(v);
            // }
            // answer = values.join(' ');
            // console.log(answer);

            // values = output.split(' ');
            // for (let r = 1; r <= i; r++)
            // {
            //     let v = values.shift();
            //     values.push(v);
            // }
            // answer = values.join(' ');

            return output;
        }
    }

    if (answer === undefined)
        return "Could not decrypt";

    return answer;
}

async function find()
{
    let ok = 0;
    while (1)
    {
        let message = SuperRot_getEncryptedMessage();   
        let answer = rotate(message);     
        if (! await SuperRot_submit(answer))
            ok = 0;
        else
        {
            ok++;
            if (ok === 50)
                break;
        }
    }
}

function XORSOLVE()
{
    function fromHex(input)
    {
        let hex = "0123456789abcdef";
        let output = [];
        for (let i = 0; i < input.length; i += 2)
        {
            let c1 = input[i];
            let c2 = input[i+1];

            let v1 = hex.indexOf(c1);
            let v2 = hex.indexOf(c2);

            let c = (v1 << 4) | v2;
            output.push(c);
        }
        return output;
    } 

    function xor(input, key)
    {
        let l = key.length;
        let i = 0;
        let output = [];
        let valid = true;
        while (i < input.length)
        {
            let c = input[i];
            let m = key[i % l];
            let v = c ^ m;
            output.push(v);
            i++;
            if (v < 32)
                valid = false;
        }

        if (valid)
        {
            let s = String.fromCharCode(...output);
            if (s === "the quick brown fox jumps over the lazy dog")
            {
                let k = String.fromCharCode(...key);
                console.log(k, '->', s);
            }
        }
        return output;
    }

    function *findValids(input, index)
    {
        let good = ' ,.;!?';

        for (let v = 1; v < 256; v++)
        {
            let valid = true;
            for (let c = index; c < input.length; c += 6)
            {
                let x = input[c] ^ v;
                if (x < 32 || x >= 128)
                {
                    valid = false;
                    break;
                }

                let s = String.fromCharCode(x);
                if ((s >= 'a' && s <= 'z') || (s >= 'A' && s <= 'Z') || good.indexOf(s) >= 0)
                {
                    let xx = 1;
                }
                else
                {
                    valid = false;
                    break;
                }
            }

            if (valid)
                yield v;
        }    
    }

    function solve(input, key, index)
    {
        if (index >= 6)
        {
            xor(input, key);
            return;
        }

        for (let i of findValids(input, index))
        {
            key[index] = i;
            solve(input, key, index+1);
        }
    }

    let data = fromHex("0300264609301e0b28461a37181f2d461e2a0f482913153504482c101d37571c2b03582916123a461c2a10");
    let key  = fromHex('010203040506');
    solve(data, [], 0);
}

// !!! GOOD !!!
// aol ibpsa pz uva => the built is not 
// dwrejc seod whok zk, bwpdan dkla. +> having wish also do, father hope.
// trigv kf yfgv. jfe, z sv sldgp kff! sldgp trcc jyzicvp. => carpe to hope. son, i be bumpy too! bumpy call shirley.

let input = "psgxpc! ajrzn?' gdqxchdc, pc x'b uaj p gddb! lwpi";

let answer = rotate(input);
console.log(answer);