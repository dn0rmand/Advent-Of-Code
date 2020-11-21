module.exports = function(file)
{
    function *read()
    {
        const readline = require('n-readlines');
        const stream = new readline(file || __filename);

        let line;
        while (line = stream.next())
        {
            yield line.toString('ascii');
        }
    }

    return read();
}
