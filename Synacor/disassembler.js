module.exports = function () {
    function asHexa(value, length)
    {
        let str = value.toString(16);
        if (typeof(length) === "number")
        {
            while (str.length < length)
                str = '0' + str;
        }
        return '0x' + str;
    }

    function isRegister(register) {
        if (typeof (register) !== "number")
            throw "Invalid Argument";

        if (register >= 32768 && register <= 32775)
            return true;
            
        return false;
    }

    function getRegister(register) {
        if (isRegister(register)) {
            const reg0 = 'A'.charCodeAt(0);

            let reg = String.fromCharCode(reg0 + (register - 32768));

            return reg;
        }

        throw "Invalid Argument";
    }

    function getValue(arg1, length) {
        if (! isRegister(arg1))
            return asHexa(arg1, length);
        else
            return getRegister(arg1);
    }

    let outInstruction;

    let vm = {
        $opcodes: [],
        $memory: [],
        $current: 0,

        execute: function () {
            let address = this.$current;
            let code = this.readMemory(this.$current++);
            if (code >= this.$opcodes.length)
                throw "Invalid opcode " + asHexa(code);

            let instruction = this.$opcodes[code];
            let result;

            if (instruction === outInstruction)
            {
                let str = null;
                let needQuote = true;
                let nextCode;

                this.$current--;
                do
                {
                    this.$current++;
                    var c = this.readMemory(this.$current++);
                    if (isRegister(c))
                    {
                        if (str != null)
                            str += "' + " + getRegister(c);
                        else
                            str = "print " + getRegister(c);

                        needQuote = true;
                    }
                    else 
                    {
                        if (str == null)
                            str = "print '";
                        else if (needQuote)
                            str += " + '";
                        needQuote = false;

                        if (c === 10)
                            str += '\\n';
                        else if (c === 13)
                            str += '\\r';
                        else if (c === 9)
                            str += '\\t';
                        else if (c < 32)  
                            str += '\\x0' + asHexa(c);
                        else
                            str += String.fromCharCode(c);
                    }
                    nextCode = this.readMemory(this.$current);
                }
                while(code === nextCode);

                if (! needQuote)
                    str += "'";
                result = str;
            }
            else
            {
                let args = [];

                for (let i = 0; i < instruction.argCount; i++) {
                    var c = this.readMemory(this.$current++);
                    args.push(c);
                }          

                result = instruction.fn(...args);
            }

            if (result === '')
                return '';
            return asHexa(address, 4) + ':  ' + result;
        },
        readMemory: function (address) {
            address <<= 1; // 2 bytes per address
            let lo = this.$memory[address];
            let hi = this.$memory[address + 1];

            return (hi << 8) | lo;
        }
    };

    function addOpcode(argCount, fcnt) {
        let inst = {
            argCount: argCount,
            fn: fcnt
        };

        vm.$opcodes.push(inst);
        return inst;
    }

    // halt
    addOpcode(0, () => {
        return 'halt';
    });
    // set   
    addOpcode(2, (a, b) => {
        a = getRegister(a);
        b = getValue(b);
        return a + ' = ' + b;
    });
    // push
    addOpcode(1, (a) => {
        return 'push ' + getValue(a, 4);
    });
    // pop
    addOpcode(1, (a) => {
        return getRegister(a) + ' = pop';
    });
    // eq
    addOpcode(3, (a, b, c) => {
        return getRegister(a) + ' = (' + getValue(b) + ' == ' + getValue(c)+') ? 1 : 0'; 
    });
    // gt
    addOpcode(3, (a, b, c) => {
        return getRegister(a) + ' = (' + getValue(b) + ' > ' + getValue(c)+') ? 1 : 0'; 
    });
    // jmp
    addOpcode(1, (a) => {
        return 'jmp ' + getValue(a, 4);
    });
    // jt
    addOpcode(2, (a, b) => {
        return 'if (' + getValue(a) + ' != 0) jmp ' + getValue(b, 4);
    });
    // jf
    addOpcode(2, (a, b) => {
        return 'if (' + getValue(a) + ' == 0) jmp ' + getValue(b, 4);
    });
    // add
    addOpcode(3, (a, b, c) => {
        return getRegister(a) + ' = ' + getValue(b) + ' + ' + getValue(c);
    });
    // mult
    addOpcode(3, (a, b, c) => {
        return getRegister(a) + ' = ' + getValue(b) + ' * ' + getValue(c);
    });
    // mod
    addOpcode(3, (a, b, c) => {
        return getRegister(a) + ' = ' + getValue(b) + ' % ' + getValue(c);
    });
    // and
    addOpcode(3, (a, b, c) => {
        return getRegister(a) + ' = ' + getValue(b) + ' & ' + getValue(c);
    });
    // or
    addOpcode(3, (a, b, c) => {
        return getRegister(a) + ' = ' + getValue(b) + ' | ' + getValue(c);
    });
    // not
    addOpcode(2, (a, b) => {
        return getRegister(a) + ' = ~' + getValue(b);
    });
    // rmem
    addOpcode(2, (a, b) => {
        return getRegister(a) + ' = [ ' + getValue(b, 4) + ' ]';
    });
    // wmem
    addOpcode(2, (a, b) => {
        return '[ ' + getValue(a, 4) + ' ] = ' + getValue(b);
    });
    // call
    addOpcode(1, (a) => {
        return 'call ' + getValue(a, 4);
    });
    // ret
    addOpcode(0, () => {
        return 'return';
    });
    // out

    //outInstruction = 
    
    addOpcode(1, (a) => {
        if (isRegister(a) || a < 32)
            return 'print ' + getValue(a);                
        else
            return "print '" + String.fromCharCode(a) + "'";
    });
    // in
    addOpcode(1, (a) => {
        return getRegister(a) + ' = read';
    });
    // noop
    addOpcode(0, () => {
        return '';
    });

    return vm;
}