module.exports = function(filename)
{
    function *read()
    {
        const readline = require('n-readlines');
        let  idx       = filename.lastIndexOf('.');
        if (idx < 0) {
            throw `. not found in ${filename}`;
        }
        filename = filename.substr(0, idx+1)+'data';
        idx = filename.lastIndexOf('/');
        if (idx >= 0) {
            filename = filename.substr(0, idx+1) + "Data/" + filename.substr(idx+1);
        } else {
            filename = "Data/" + filename;
        }
        const stream = new readline(filename);

        let line;
        while (line = stream.next())
        {
            yield line.toString('ascii');
        }
    }

    return read();
}
