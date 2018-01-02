const base64 = require('js-base64').Base64;

let s1 = base64.decode('U2VuZGluZyBDaH Jpc3RtYXMgY2Fy ZHMgdG8gYmFkIG FkZHJlc3Nlcz8K');

console.log(s1); // Sending Christmas cards to bad addresses?


console.log(xor('Pz0pQUI7ChcmER8YDAEYAh4LGwEP', '↑↑↓↓←→←→BA'));

function xor(input1, input2)
{
    // input1 = input1.split('');
    // input2 = input2.split('');

    let output = [];

    for(let i = 0; i < input1.length; i++)
        output[i] = input1.charCodeAt(i);

    for(let j = 0; j < input2.length; j++)
    {
        let mask = input2.charCodeAt(j);

        for(let i = 0; i < output.length; i++)
        {
            let c1 = output[i];

            c1 = c1 ^ mask;
            output[i] = c1;
        }
    }
    for(let i = 0; i < output.length; i++)
        output[i] = String.fromCharCode(output[i]);
    let s = output.join('');
    return s;
}