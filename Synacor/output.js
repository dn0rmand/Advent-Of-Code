module.exports = function () {
    //process.stdout.resume();

    let output = '';

    let self = {
        didPrint: function (output) {
            console.log(output);
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