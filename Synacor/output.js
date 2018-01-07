module.exports = function () {
    //process.stdout.resume();
    const console = require('simple-console-color');

    let output = '';

    let self = {
        didPrint: function (output) {
            console.logBlue(output);
        },
        print: function (v) {

            let s = String.fromCharCode(v);

            if (v === 13 || v === 10) {
                self.didPrint(output);
                output = '';
            } else
                output += s;
        }
    }
    return self;
}