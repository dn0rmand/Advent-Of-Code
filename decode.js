const base64 = require('js-base64').Base64;
const rot13 = require('rot-13');

let s1 = base64.decode('U2VuZGluZyBDaH Jpc3RtYXMgY2Fy ZHMgdG8gYmFkIG FkZHJlc3Nlcz8K');

console.log(s1); // Sending Christmas cards to bad addresses?

s1 = base64.decode('4oqVKEhnZ0pBZ3RUUkVBZUZCOEtDQjBMQjBNWkNSVkJNd3dSSXg4Y0VBb0hIUXdkQXgwSENnPT0sIOKGkeKGkeKGk+KGk+KGkOKGkuKGkOKGkkJBKQ==');
s1 = s1.replace('↑↑↓↓←→←→BA', 'konami');

let key   = s1.split(',')[1].split(')')[0].trim();
let input = s1 = s1.split(',')[0].split('(')[1].trim();

console.log(xor(input, key));
console.log(xor('Pz0pQUI7Ch cmER8YDAEYAh4L GwEP', '↑↑↓↓←→←→BA'));

function xor(input1, input2)
{
    // '↑↑↓↓←→←→BA' = konami code

    if (input2 === '↑↑↓↓←→←→BA')
        input2 = 'konami';

    let output = [];
    let code   = [];

    input1 = base64.decode(input1);

    for(let i = 0; i < input1.length; i++)
        output[i] = input1.charCodeAt(i);

    for(let i = 0; i < input2.length; i++)
    {
        let c = input2.charCodeAt(i);
        code.push(c);
    }

    let i = 0;

    for(let j = 0; j < input1.length; j++)
    {
        let c = output[j];
        let x = code[i];
        output[j] ^= x;        
        i = (i+1) % code.length;
    }

    let s = output.reduce((a, c) => a + String.fromCharCode(c), '');
    s = rot13(s);
    return s;
}