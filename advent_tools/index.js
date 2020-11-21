module.exports = function()
{
    return  {
        readFile: require('./readfile'),
        runAsync: async function(action) {
            await action();
        }
    }
}
