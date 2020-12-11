from typing import NamedTuple, List
from time import time
from interpreter import Interpreter

def day19():
    def doit(A:int) -> int:
        B, C, D, E = 0, 0, 0, 0 
        
        E = 2*2*19*11
        D = (2*22)+13
        E+= D

        if A == 1:
            D = (27*28 + 29) * 30 * 14 * 32
            E+= D

        A = 0
        C = 1
        while True:
            B = 1

            while True:
                D = B * C
                if D == E: 
                    A += C
                B += 1
                if D > E: break

            C += 1
            if C > E: break
        
        return A

    def part1Fast() -> None:
        answer = doit(0)
        print("Answer part 1 is", answer)

    def part1(program: Interpreter) -> None:
        program.execute(lambda pr, ip: 12 if ip == 4 and pr.registers[3] > pr.registers[4] else None)
        answer = program.registers[0]
        print("Answer part 1 is", answer)

    def part2Fast() -> None:
        answer = doit(1)
        print("Answer part 2 is", answer)

    def part2(program: Interpreter) -> None:
        program.reset()
        program.registers[0] = 1
        program.execute(lambda pr, ip : 12 if ip == 4 and pr.registers[3] > pr.registers[4] else None)
        answer = program.registers[0]
        print("Answer part 2 is", answer)

    print("")
    print("********************************")
    print("* Advent of Code 2018 - Day 19 *")
    print("********************************")
    print("")

    start = time()
    program = Interpreter('2018/data/day19.data')
    # program.dump()

    end = time()
    print("Loaded in", round((end-start)*1000), "ms")

    start = time()
    part1Fast()
    end = time()
    print("Part 1 (fast) executed in", round((end-start)*1000), "ms")

    start = time()
    part2Fast()
    end = time()
    print("Part 2 (fast) executed in", round((end-start)*1000), "ms")

    # start = time()
    # part1(program)
    # end = time()
    # print("Part 1 executed in", round((end-start)*1000), "ms")

    # start = time()
    # part2(program)
    # end = time()
    # print("Part 2 executed in ", round((end-start)*1000), "ms")
