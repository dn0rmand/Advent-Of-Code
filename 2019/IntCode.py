from typing import Iterator, Callable

class IntCode:
    def __init__(self, filename: str) -> None:
        # self.registers  = [0] * 6
        self.program    = []
        self.ip         = 0

        with open(filename, 'rt') as data:
            for opcode in data.readline().split(','):
                self.program.append(int(opcode))

    def load(self) -> None:
        self.memory = [byte for byte in self.program]
        self.ip     = 0

    def readNext(self) -> int:
        value = self.peek(self.ip)
        self.ip += 1
        return value

    def peek(self, address: int) -> int:
        if address < 0 or address >= len(self.memory):
            raise Exception("Out of range")
        return self.memory[address]

    def poke(self, address: int, value: int) -> None:
        if address < 0 or address >= len(self.memory):
            raise Exception("Out of range")
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

        if not (modeA == 0 or modeA == 1):
            raise Exception("Mode not supported in IntCode")
        if not (modeB == 0 or modeB == 1):
            raise Exception("Mode not supported in IntCode")
        if not (modeC == 0 or modeC == 1):
            raise Exception("Mode not supported in IntCode")

        return (opcode, modeA, modeB, modeC)

    def readParameter(self, mode: int) -> int:
        value = self.readNext()
        if mode == 0:
            value = self.peek(value)
        return value

    def writeParameter(self, mode: int, value: int) -> None:
        if not mode == 0:
            raise Exception("Mode 1 not supported")
        address = self.readNext()
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
            self.writeParameter(mode1, next(self.input))

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

    def initialize(self, input: Iterator[int], output: Callable[[int], None]) -> None:
        self.load()
        self.output = output
        self.input  = input

    def execute(self, debug: bool) -> None:
        self.ip = 0
        while self.ip >= 0:
            if debug:
                self.dump()
            self.step()

    def parameter(self, mode: int) -> str:
        value = self.readNext()
        if mode == 0:
            return "[{0:#06x}]".format(value)
        else:
            return str(value)

    def dump(self) -> None:
        oldip = self.ip

        opcode, mode1, mode2, mode3 = self.getNextInstruction()
        if opcode == 99:
            print("{0:#06x}: HALT".format(oldip))

        elif opcode == 1:
            v1 = self.parameter(mode1)
            v2 = self.parameter(mode2)
            v3 = self.parameter(mode3)
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
                print("{0:#06x}: {1} {4}= {2}".format(oldip, v3, v1, v2, sign))
            elif v3 == v1:
                print("{0:#06x}: {1} {4}= {3}".format(oldip, v3, v1, v2, sign))
            else:
                print("{0:#06x}: {1}  = {2} {4} {3}".format(oldip, v3, v1, v2, sign))

        elif opcode == 2:
            v1 = self.parameter(mode1)
            v2 = self.parameter(mode2)
            v3 = self.parameter(mode3)

            if v3 == v1:
                print("{0:#06x}: {1} *= {3}".format(oldip, v3, v1, v2))
            elif v3 == v2:
                print("{0:#06x}: {1} *= {2}".format(oldip, v3, v1, v2))
            else:
                print("{0:#06x}: {1}  = {2} * {3}".format(oldip, v3, v1, v2))

        elif opcode == 3:
            v1 = self.parameter(mode1)

            print("{0:#06x}: {1}  = INPUT".format(oldip, v1))

        elif opcode == 4:
            v1 = self.parameter(mode1)

            print("{0:#06x}: OUTPUT    = {1}".format(oldip, v1))

        elif opcode == 5: # jump if true
            v1 = self.parameter(mode1)
            v2 = self.parameter(mode2)
            if mode2 == 1:
                v2 = int(v2)
                print("{0:#06x}: GOTO {2:#06x} IF {1} != 0 ".format(oldip, v1, v2))
            else:
                print("{0:#06x}: GOTO {2} IF {1} != 0 ".format(oldip, v1, v2))

        elif opcode == 6: # jump if false
            v1 = self.parameter(mode1)
            v2 = self.parameter(mode2)
            if mode2 == 1:
                v2 = int(v2)
                print("{0:#06x}: GOTO {2:#06x} IF {1} == 0 ".format(oldip, v1, v2))
            else:
                print("{0:#06x}: GOTO {2} IF {1} == 0 ".format(oldip, v1, v2))

        elif opcode == 7: # less than
            v1 = self.parameter(mode1)
            v2 = self.parameter(mode2)
            v3 = self.parameter(mode3)
            print("{0:#06x}: {3}  = 1 IF {1} < {2} ELSE 0".format(oldip, v1, v2, v3))

        elif opcode == 8: # equals
            v1 = self.parameter(mode1)
            v2 = self.parameter(mode2)
            v3 = self.parameter(mode3)
            print("{0:#06x}: {3}  = 1 IF {1} == {2} ELSE 0".format(oldip, v1, v2, v3))

        self.ip = oldip
