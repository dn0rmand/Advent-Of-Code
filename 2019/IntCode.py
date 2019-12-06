from typing import Iterator

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
            self.output.append(value)

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

    def initialize(self, input: Iterator[int], output: [int]) -> None:
        self.load()
        self.output = output
        self.input  = input

    def execute(self) -> None:
        self.ip = 0
        while self.ip >= 0:
            self.step()

    def dump(self) -> None:
        print('Not implemented')