from IntCode import IntCode

def part1(program):
    def input():
        while True:
            yield 1

    output = []

    program.initialize(input(), output)
    program.execute()

    for v in output[:-2]:
        if not v == 0:
            raise Exception("Tests failed")
    return output[-1]

def part2(program):
    def input():
        while True:
            yield 5

    output = []

    program.initialize(input(), output)
    program.execute()

    return output[0]

print("")
print("*******************************")
print("* Advent of Code 2019 - Day 5 *")
print("*******************************")
print("")

program = IntCode('2019/data/day5.data')

print("Answer part 1 is", part1( program ))
print("Answer part 2 is", part2( program ))

print("")
