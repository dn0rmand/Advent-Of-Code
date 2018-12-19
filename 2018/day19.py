from typing import NamedTuple, List
from time import time

class Instruction:
    def __init__(self, name: str, a:int, b:int, c:int) -> None:
        self.name = name
        self.a = a
        self.b = b
        self.c = c

class Interpreter:
    def __init__(self) -> None:

        self.registers = [0] * 6
        self.instructions = []
        self.ip = 0

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

        with open('2018/data/day19.data', 'rt') as data:
            line = data.readline()
            self.ip = int(line[4])
            line = data.readline().strip()
            while line:
                line = line.split(' ')
                instruction = Instruction(line[0], int(line[1]), int(line[2]), int(line[3]))
                self.instructions.append(instruction)
                line = data.readline().strip()

    def reset(self) -> None:
        for i in range(0, len(self.registers)):
            self.registers[i] = 0

    def execute(self) -> None:
        current = 0
        while current < len(self.instructions):
            self.registers[self.ip] = current
            i = self.instructions[current]
            code = self.opcodes[i.name]
            v = code(i.a, i.b, i.c)
            self.registers[i.c] = v
            current = self.registers[self.ip]
            current += 1

def part1(program: Interpreter) -> None:
    program.execute()
    answer = program.registers[0]
    print("Answer part 1 is", answer)

def part2(program: Interpreter) -> None:
    program.reset()
    program.registers[0] = 1
    program.execute()
    answer = program.registers[0]
    print("Answer part 2 is", 0)

print("")
print("********************************")
print("* Advent of Code 2018 - Day 19 *")
print("********************************")
print("")

start = time()

program = Interpreter()

start1 = time()
part1(program)
end = time()
print("Part 1 executed in ", round((end-start1)*1000), "ms")

start2 = time()
part2(program)
end = time()
print("Part 2 executed in ", round((end-start2)*1000), "ms")
print("")
print("Total time (including loading data) is", round((end-start)*1000), "ms")
