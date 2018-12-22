from typing import NamedTuple, List
from time import time
from interpreter import Interpreter

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

def part1(program: Interpreter) -> None:
    answer = doit(False)
    print("Answer part 1 is", answer)

def part2(program: Interpreter) -> None:
    answer = doit(True)
    print("Answer part 2 is", answer)

print("")
print("********************************")
print("* Advent of Code 2018 - Day 21 *")
print("********************************")
print("")

start = time()
program = Interpreter()
program.dump()
end = time()

print("Loaded in", round((end-start)*1000), "ms")

start = time()
part1(program)
end = time()
print("Part 1 executed in", round((end-start)*1000), "ms")

start = time()
part2(program)
end = time()
print("Part 2 executed in ", round((end-start)*1000), "ms")
