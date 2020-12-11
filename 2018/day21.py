from typing import NamedTuple, List
from time import time
from interpreter import Interpreter

def day21():
    def doit(part2: bool):
        maxB = 0
        lastB = 0

        B = 0x7b
        while True:
            B = B & 0x1c8
            if B == 0x48: break

        visited = {}

        B = 0x0
        while True:
            D = B | 0x10000
            B = 0xa668b0
            while True:
                B += D & 0xff
                B = ((B & 0xffffff) * 0x1016b) & 0xffffff
                if D < 0x100: 
                    break
                
                D = D // 0x100

            if not part2:
                return B

            if B in visited:
                return lastB
        
            visited[B] = 1
            lastB = B

    def part1() -> None:
        answer = doit(False)
        print("Answer part 1 is", answer)

    def part2() -> None:
        answer = doit(True)
        print("Answer part 2 is", answer)

    def slowPart1(program: Interpreter) -> None:

        def filter(program: Interpreter, ip:int) -> int:
            i = program.instructions[ip]
            if i.name == "eqrr":
                return 10000 # halt
            else:
                return None

        program.execute(filter)
        answer = program.registers[1]
        print("Answer part 1 is", answer)

    def slowPart2(program: Interpreter) -> None:
        answer  = [0] # otherwise cannot be set from method filter
        visited = set()

        def filter(program: Interpreter, ip:int) -> int:
            i = program.instructions[ip]
            if i.name == "eqrr":
                v = program.registers[1]
                if v in visited:
                    return 10000 # halt
                visited.add(v)
                answer[0] = v
                return None
            elif ip == 17:
                program.registers[3] //= 256
                return 8
            else:
                return None

        program.execute(filter)
        print("Answer part 2 is", answer[0])

    print("")
    print("********************************")
    print("* Advent of Code 2018 - Day 21 *")
    print("********************************")
    print("")

    start = time()
    program = Interpreter('2018/data/day21.data')
    program.dump()
    end = time()

    print("Loaded in", round((end-start)*1000), "ms")

    start = time()
    # part1()
    slowPart1(program)
    end = time()
    print("Part 1 executed in", round((end-start)*1000), "ms")

    start = time()
    # part2()
    slowPart2(program)
    end = time()
    print("Part 2 executed in ", round((end-start)*1000), "ms")
