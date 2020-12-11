from enum import Enum
from time import time

def day16():
    class OpCode(Enum):
        addr = 0
        addi = 1
        mulr = 2
        muli = 3
        banr = 4
        bani = 5
        borr = 6
        bori = 7
        setr = 8
        seti = 9
        gtir = 10
        gtri = 11
        gtrr = 12
        eqir = 13
        eqri = 14
        eqrr = 15

    def loadData():
        part1 = []
        part2 = []

        with open('2018/data/day16.data', 'rt') as data:        
            while True:
                line = data.readline().strip()
                if not line: break

                before = (int(line[9]), int(line[12]), int(line[15]), int(line[18]) )

                line = data.readline().strip()
                instruction = [int(c) for c in line.split(' ')]

                line = data.readline().strip()
                after = (int(line[9]), int(line[12]), int(line[15]), int(line[18]) )

                line = data.readline().strip()
                assert not line

                part1.append((instruction, before, after))

            while not line:
                line = data.readline().strip()
                
            while line:
                instruction = [int(c) for c in line.split(' ')]
                part2.append(instruction)
                line = data.readline()

        return part1, part2

    def execute(opCode, instruction, registers):
        dummy, a, b, c = instruction

        output = [r for r in registers]

        if opCode == OpCode.addr:
            output[c] = registers[a]+registers[b]
        elif opCode == OpCode.addi:
            output[c] = registers[a]+b

        elif opCode == OpCode.mulr:
            output[c] = registers[a]*registers[b]
        elif opCode == OpCode.muli:
            output[c] = registers[a]*b

        elif opCode == OpCode.banr:
            output[c] = registers[a] & registers[b]
        elif opCode == OpCode.bani:
            output[c] = registers[a] & b

        elif opCode == OpCode.borr:
            output[c] = registers[a] | registers[b]
        elif opCode == OpCode.bori:
            output[c] = registers[a] | b

        elif opCode == OpCode.setr:
            output[c] = registers[a]
        elif opCode == OpCode.seti:
            output[c] = a

        elif opCode == OpCode.gtir:
            output[c] = 1 if a > registers[b] else 0
        elif opCode == OpCode.gtri:
            output[c] = 1 if registers[a] > b else 0
        elif opCode == OpCode.gtrr:
            output[c] = 1 if registers[a] > registers[b] else 0

        elif opCode == OpCode.eqir:
            output[c] = 1 if a == registers[b] else 0
        elif opCode == OpCode.eqri:
            output[c] = 1 if registers[a] == b else 0
        elif opCode == OpCode.eqrr:
            output[c] = 1 if registers[a] == registers[b] else 0
        else:
            raise Exception("Invalid opcode")

        return (output[0], output[1], output[2], output[3])

    def mapOpCodes(data):
        opCodeMap = {}

        for i in range(0, 16):
            opCodeMap[i] = set()

        answer = 0
        for entry in data:
            count = 0
            instruction, before, after = entry
            for opcode in OpCode:
                output = execute(opcode, instruction, before)
                if output == after:
                    op = instruction[0]
                    opCodeMap[op].add(opcode)
                    count += 1

            if count >= 3:
                answer += 1

        return answer, opCodeMap

    def part1(data):
        answer, opmap = mapOpCodes(data)
        print("Answer part 1 is", answer)
        return opmap

    def part2(opMap, program):
        OPCODES = {}

        while len(opMap) > 0:
            singles = [op for op in opMap if len(opMap[op]) == 1]

            if len(singles) == 0: raise Exception("Cannot solve it")

            for s in singles:
                opcode = opMap[s].pop()
                OPCODES[s] = opcode
                opMap.pop(s)
                for x in opMap:
                    opMap[x].discard(opcode)

        registers = (0, 0, 0, 0)
        for instruction in program:
            opcode = OPCODES[instruction[0]]
            registers = execute(opcode, instruction, registers)

        answer = registers[0]
        print("Answer part 2 is", answer)

    print("")
    print("********************************")
    print("* Advent of Code 2018 - Day 16 *")
    print("********************************")
    print("")

    start = time()

    p1, p2 = loadData()

    start1 = time()
    opmap = part1(p1)
    end = time()
    print("Part 1 executed in ", round((end-start1)*1000), "ms")

    start2 = time()
    part2(opmap, p2)
    end = time()
    print("Part 2 executed in ", round((end-start2)*1000), "ms")
    print("")
    print("Total time (including loading data) is", round((end-start)*1000), "ms")
