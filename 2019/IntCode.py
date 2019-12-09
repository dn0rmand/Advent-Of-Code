from typing import Iterator, Callable

class IntCode:
    def __init__(self, filename: str = None) -> None:
        # self.registers  = [0] * 6
        self.program    = []
        self.ip         = 0
        self.base       = 0
        self.lastInput  = None

        if not filename == None:
            with open(filename, 'rt') as data:
                for opcode in data.readline().split(','):
                    self.program.append(int(opcode))

    def clone(self):
        copy = IntCode()
        copy.program = self.program
        return copy

    def load(self) -> None:
        self.memory = [byte for byte in self.program]
        self.ip     = 0
        self.base   = 0

    def readNext(self) -> int:
        value = self.peek(self.ip)
        self.ip += 1
        return value

    def peek(self, address: int) -> int:
        if address < 0:
            raise Exception("invalid negative address")
        if address >= len(self.memory):
            extra = address+1-len(self.memory)
            self.memory.extend([0]*extra)
        return self.memory[address]

    def poke(self, address: int, value: int) -> None:
        if address < 0:
            raise Exception("invalid negative address")
        if address >= len(self.memory):
            extra = address+1-len(self.memory)
            self.memory.extend([0]*extra)

        self.memory[address] = value

    def getNextInstruction(self) -> (int, int, int, int):
        instruction = self.readNext()
        opcode = instruction % 100
        instruction = int((instruction-opcode)/100)

        modeA  = instruction % 10
        instruction = int((instruction-modeA)/10)
        modeB  = instruction % 10
        instruction = int((instruction-modeB)/10)
        modeC  = instruction % 10

        if not (modeA == 0 or modeA == 1 or modeA == 2):
            raise Exception("Mode not supported in IntCode")
        if not (modeB == 0 or modeB == 1 or modeB == 2):
            raise Exception("Mode not supported in IntCode")
        if not (modeC == 0 or modeC == 1 or modeC == 2):
            raise Exception("Mode not supported in IntCode")

        return (opcode, modeA, modeB, modeC)

    def readParameter(self, mode: int) -> int:
        address = self.readNext()
        if mode == 0:
            address = self.peek(address)
        elif mode == 2:
            address = self.peek(self.base+address)
        return address

    def writeParameter(self, mode: int, value: int) -> None:
        if not (mode == 0 or mode ==  2):
            raise Exception("Mode 1 not supported")
        address = self.readNext()
        if mode == 2:
            address += self.base
        self.poke(address, value)

    def step(self) -> None:
        opcode, mode1, mode2, mode3 = self.getNextInstruction()

        if opcode == 99: # halt
            self.ip = -1

        elif opcode == 1: # add
            a = self.readParameter(mode1)
            b = self.readParameter(mode2)
            self.writeParameter(mode3, a + b)

        elif opcode == 2: # multiply
            a = self.readParameter(mode1)
            b = self.readParameter(mode2)
            self.writeParameter(mode3, a * b)

        elif opcode == 3: # read input
            self.lastInput = next(self.input)
            self.writeParameter(mode1, self.lastInput)

        elif opcode == 4: # write output
            value = self.readParameter(mode1)
            self.output(value)

        elif opcode == 5: # jump if true
            v1 = self.readParameter(mode1)
            v2 = self.readParameter(mode2)
            if not v1 == 0:
                self.ip = v2

        elif opcode == 6: # jump if false
            v1 = self.readParameter(mode1)
            v2 = self.readParameter(mode2)
            if v1 == 0:
                self.ip = v2

        elif opcode == 7: # less than
            v1 = self.readParameter(mode1)
            v2 = self.readParameter(mode2)
            self.writeParameter(mode3, 1 if v1 < v2 else 0)

        elif opcode == 8: # equals
            v1 = self.readParameter(mode1)
            v2 = self.readParameter(mode2)
            self.writeParameter(mode3, 1 if v1 == v2 else 0)

        elif opcode == 9: # adjusts the relative base
            v1 = self.readParameter(mode1)
            self.base += v1

    def initialize(self, input: Iterator[int], output: Callable[[int], None]) -> None:
        self.load()
        self.output = output
        self.input  = input

    def execute(self, debug: bool, trace: Callable[[None], None] = None) -> None:
        self.ip   = 0
        self.base = 0
        while self.ip >= 0:
            op = None
            if debug:
                op = self.dump()
            self.step()
            if debug:
                self.postDump(op)
            if not trace == None:
                trace()

    def parameter(self, mode: int) -> (str, int):
        value = self.readNext()
        if mode == 0:
            return ("[{0:#06x}]".format(value), self.peek(value))
        elif mode == 2:
            if value < 0:
                return ("[base-{0}]".format(-value), self.peek(self.base+value))
            else:
                return ("[base+{0}]".format(value), self.peek(self.base+value))
        else:
            return (str(value), value)

    def postDump(self, opcode: int) -> None:
        if opcode == 3:
            print(" <- {0}".format(self.lastInput))
        else:
            print("")

    def dump(self) -> int:
        oldip = self.ip

        opcode, mode1, mode2, mode3 = self.getNextInstruction()
        print("{0:#06x}: {1} - ".format(oldip, opcode), end="")

        if opcode == 99:
            print("HALT", end="")

        elif opcode == 1:
            v1,v11 = self.parameter(mode1)
            v2,v22 = self.parameter(mode2)
            v3,v33 = self.parameter(mode3)
            sign = '+'
            if mode2 == 1 and int(v2) < 0:
                sign = '-'
                v2 = str(-int(v2))
            elif mode1 == 1 and int(v1) < 0:
                sign = str(-int(v1))
                v1 = v2
                v2 = sign
                sign = '-'

            if v3 == v2:
                print("{1} {4}= {2} -> {5}".format(oldip, v3, v1, v2, sign, v11+v22), end="")
            elif v3 == v1:
                print("{1} {4}= {3} -> {5}".format(oldip, v3, v1, v2, sign, v11+v22), end="")
            else:
                print("{1}  = {2} {4} {3} -> {5}".format(oldip, v3, v1, v2, sign, v11+v22), end="")

        elif opcode == 2:
            v1,v11 = self.parameter(mode1)
            v2,v22 = self.parameter(mode2)
            v3,_ = self.parameter(mode3)

            if v3 == v1:
                print("{1} *= {3} -> {4}".format(oldip, v3, v1, v2, v11*v22), end="")
            elif v3 == v2:
                print("{1} *= {2} -> {4}".format(oldip, v3, v1, v2, v11*v22), end="")
            else:
                print("{1}  = {2} * {3} -> {4}".format(oldip, v3, v1, v2, v11*v22), end="")

        elif opcode == 3:
            v1, _ = self.parameter(mode1)

            print("{1}  = INPUT".format(oldip, v1), end="")

        elif opcode == 4:
            v1, v11 = self.parameter(mode1)

            print("OUTPUT    = {1} -> {2}".format(oldip, v1, v11), end="")

        elif opcode == 5: # jump if true
            v1, v11 = self.parameter(mode1)
            v2, v22 = self.parameter(mode2)
            if mode2 == 1:
                v2=int(v2)
                print("GOTO {2:#06x} IF {1} != 0 -> {3}".format(oldip, v1, v2, "NO" if v11==0 else "GOTO {0:#06x}".format(v22)), end="")
            else:
                print("GOTO {2} IF {1} != 0 -> {3}".format(oldip, v1, v2, "NO" if v11==0 else "GOTO {0:#06x}".format(v22)), end="")

        elif opcode == 6: # jump if false
            v1, v11 = self.parameter(mode1)
            v2, v22 = self.parameter(mode2)
            if mode2 == 1:
                v2=int(v2)
                print("GOTO {2:#06x} IF {1} == 0 -> {3}".format(oldip, v1, v2, "GOTO {0:#06x}".format(v22) if v11==0 else "NO"), end="")
            else:
                print("GOTO {2} IF {1} == 0 -> {3}".format(oldip, v1, v2, "GOTO {0:#06x}".format(v22)  if v11==0 else "NO"), end="")

        elif opcode == 7: # less than
            v1, v11 = self.parameter(mode1)
            v2, v22 = self.parameter(mode2)
            v3, _   = self.parameter(mode3)
            print("{3}  = 1 IF {1} < {2} ELSE 0 -> {4}".format(oldip, v1, v2, v3, 1 if v11<v22 else 0), end="")

        elif opcode == 8: # equals
            v1, v11 = self.parameter(mode1)
            v2, v22 = self.parameter(mode2)
            v3, _   = self.parameter(mode3)
            print("{3}  = 1 IF {1} == {2} ELSE 0 -> {4}".format(oldip, v1, v2, v3, 1 if v11==v22 else 0), end="")

        elif opcode == 9: # adjusts the relative base
            v1, v11 = self.parameter(mode1)
            if mode1 == 1 and v11 < 0:
                print("base -= {2} -> {2}".format(oldip, v1, v11), end="")
            else:
                print("base += {1} -> {2}".format(oldip, v1, v11), end="")

        else:
            print("unsupported opcode {1}".format(oldip, opcode), end="")

        self.ip = oldip
        return opcode