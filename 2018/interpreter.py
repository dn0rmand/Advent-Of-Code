from typing import NamedTuple, List

letters = 'ABCDEFGHIJKLMNOP'

class Instruction:
    def __init__(self, name: str, a:int, b:int, c:int) -> None:
        self.name = name
        self.a = a
        self.b = b
        self.c = c

class Interpreter:
    def __init__(self, filename:str) -> None:
        ip = 0

        self.registers = [0] * 6
        self.instructions = []
        self.ip = 0
        
        def gotoAddr(current, ip, a, b):
            if a == ip:
                return f"goto { current + 1 } + { letters[b] }"
            elif b == ip:
                return f"goto { current + 1 } + { letters[a] }"
            else:
                return f"goto { letters[a] } + { letters[b] } + 1"

        def gotoAddi(current, ip, a, b):
            if a == ip:
                return f"goto { current + 1 + b }"
            else:
                return f"goto { letters[a] } + { b + 1 }"

        def regName(current, i):
            if i == ip:
                return current
            else:
                return f"{ letters[i] }"

        self.descriptions = {
            "addr": lambda current, a, b, c : 
                gotoAddr(current, ip, a, b) if c == ip else f"{ letters[c] } = { regName(current,a) } + { regName(current,b) }",
            "addi": lambda current, a, b, c :
                gotoAddi(current, ip, a, b) if c == ip else f"{ letters[c] } = { regName(current,a) } + { hex(b) }",
            "mulr": lambda current, a, b, c : f"{ letters[c] } = { regName(current,a) } * { regName(current,b) }",
            "muli": lambda current, a, b, c : f"{ letters[c] } = { regName(current,a) } * { hex(b) }",
            "banr": lambda current, a, b, c : f"{ letters[c] } = { regName(current,a) } & { regName(current,b) }",
            "bani": lambda current, a, b, c : f"{ letters[c] } = { regName(current,a) } & { hex(b) }",
            "borr": lambda current, a, b, c : f"{ letters[c] } = { regName(current,a) } | { regName(current,b) }",
            "bori": lambda current, a, b, c : f"{ letters[c] } = { regName(current,a) } | { hex(b) }",
            "setr": lambda current, a, b, c : 
                f"goto { current+1 } + { regName(current,a) }" if c == ip else f"{ letters[c] } = { regName(current,a) }",
            "seti": lambda current, a, b, c : 
                f"goto { a+1 }" if c == ip else f"{ letters[c] } = { hex(a) }",
            "gtir": lambda current, a, b, c : f"{ letters[c] } = 1 if { hex(a) } > { regName(current,b) } else 0",
            "gtri": lambda current, a, b, c : f"{ letters[c] } = 1 if { regName(current,a) } > { hex(b) } else 0",
            "gtrr": lambda current, a, b, c : f"{ letters[c] } = 1 if { regName(current,a) } > { regName(current,b) } else 0",
            "eqir": lambda current, a, b, c : f"{ letters[c] } = 1 if { hex(a) } == { regName(current,b) } else 0",
            "eqri": lambda current, a, b, c : f"{ letters[c] } = 1 if { regName(current,a) } == { hex(b) } else 0",
            "eqrr": lambda current, a, b, c : f"{ letters[c] } = 1 if { regName(current,a) } == { regName(current,b) } else 0",
        }

        self.opcodes = {
            "addr": lambda a, b, c : self.registers[a] + self.registers[b],
            "addi": lambda a, b, c : self.registers[a] + b ,
            "mulr": lambda a, b, c : self.registers[a] * self.registers[b],
            "muli": lambda a, b, c : self.registers[a] * b ,
            "banr": lambda a, b, c : self.registers[a] & self.registers[b],
            "bani": lambda a, b, c : self.registers[a] & b ,
            "borr": lambda a, b, c : self.registers[a] | self.registers[b],
            "bori": lambda a, b, c : self.registers[a] | b ,
            "setr": lambda a, b, c : self.registers[a],
            "seti": lambda a, b, c : a,
            "gtir": lambda a, b, c : 1 if a > self.registers[b] else 0,
            "gtri": lambda a, b, c : 1 if self.registers[a] > b else 0,
            "gtrr": lambda a, b, c : 1 if self.registers[a] > self.registers[b] else 0,
            "eqir": lambda a, b, c : 1 if a == self.registers[b] else 0,
            "eqri": lambda a, b, c : 1 if self.registers[a] == b else 0,
            "eqrr": lambda a, b, c : 1 if self.registers[a] == self.registers[b] else 0,
        }

        with open(filename, 'rt') as data:
            line = data.readline()
            ip = int(line[4])
            self.ip = ip
            line = data.readline().strip()
            while line:
                line = line.split(' ')
                instruction = Instruction(line[0], int(line[1]), int(line[2]), int(line[3]))
                self.instructions.append(instruction)
                line = data.readline().strip()

    def reset(self) -> None:
        for i in range(0, len(self.registers)):
            self.registers[i] = 0

    def execute(self, preProcessor = None) -> None:
        current = 0
        while current < len(self.instructions):
            if preProcessor != None:
                newCurrent = preProcessor(self, current)
                if newCurrent != None and newCurrent != current:
                    current = newCurrent
                    continue

            self.registers[self.ip] = current
            i = self.instructions[current]
            code = self.opcodes[i.name]
            v = code(i.a, i.b, i.c)
            self.registers[i.c] = v
            current = self.registers[self.ip]
            current += 1

    def dump(self) -> None:
        labels = {}

        def innerDump(pass1: bool) -> None:
            toSkip = {}

            def goto(index: int) -> None:
                if index >= len(self.instructions):
                    return "halt"

                i = self.instructions[index]
                if i.name == "seti" and i.c == self.ip:
                    toSkip[index] = 1
                    labels[i.a + 1] = 1
                    return f"goto { i.a + 1}"
                elif i.name == 'addi' and i.c == self.ip:
                    toSkip[index] = 1
                    labels[i.a + index] = 1
                    return f"goto { i.a + index}"
                else:
                    labels[index] = 1
                    return f"goto { index }"

            for n, i in enumerate(self.instructions):
                if n in toSkip:
                    continue

                d = None
                if n+1 < len(self.instructions):
                    next = self.instructions[n+1]
                    if i.name == "eqri" or i.name == "gtri":
                        op = ">" if i.name == 'gtri' else "=="
                        if next.name == 'addr' and next.c == self.ip:
                            if (i.c == next.a and next.b == self.ip) or (i.c == next.b and next.a == self.ip):
                                d = f"if { letters[i.a] } { op } { hex(i.b) }:\n         { goto(n+3) }\n     else:\n         { goto(n+2) }"                      

                    if i.name == "eqir" or i.name == "gtir":
                        op = ">" if i.name == 'gtir' else "=="
                        if next.name == 'addr' and next.c == self.ip:
                            if (i.c == next.a and next.b == self.ip) or (i.c == next.b and next.a == self.ip):
                                d = f"if { hex(i.a) } { op } { letters[i.b] }:\n         { goto(n+3) }\n     else:\n         { goto(n+2) }"                        

                    if i.name == "eqrr" or i.name == "gtrr":
                        op = ">" if i.name == 'gtrr' else "=="
                        if next.name == 'addr' and next.c == self.ip:
                            if (i.c == next.a and next.b == self.ip) or (i.c == next.b and next.a == self.ip):
                                d = f"if { letters[i.a] } { op } { letters[i.b] }:\n         { goto(n+3) }\n     else:\n         { goto(n+2) }"                      

                if d == None:
                    d = self.descriptions[i.name]
                    d = d(n, i.a, i.b, i.c)
                    if pass1:
                        if "goto " == d[:5]:
                            try:
                                idx = int(d[5:])
                                labels[idx] = 1
                            except:
                                pass
                else:
                    toSkip[n+1] = 1

                if not pass1:
                    if n in labels:
                        print(f"{n}:")
                    print('   ', d)

        innerDump(True)
        innerDump(False)
