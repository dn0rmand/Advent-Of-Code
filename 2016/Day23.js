module.exports = async function(test)
{
    const assembunny = require("../tools/assembunny.js");

    var compiler = assembunny.create();
    
    if (test)
        await compiler.parse("Data/Day23.test");
    else
        await compiler.parse("Data/Day23.data");

    compiler.compile();
    compiler.$registers.a = 12;
    compiler.execute();
    
    console.log("A = " + compiler.$registers.a);
    process.exit(0);
    /*

    cpy x y copies x (either an integer or the value of a register) into register y.
    inc x increases the value of register x by one.
    dec x decreases the value of register x by one.
    jnz x y jumps to an instruction y away (positive means forward; negative means backward), but only if x is not zero.

    */
}