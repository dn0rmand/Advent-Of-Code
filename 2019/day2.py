from IntCode import IntCode

def loadData():
    opcodes = []
    file = open('2019/data/day2.data', 'rt')

    data = file.readline().split(',')

    for opcode in data:
        opcodes.append(int(opcode))

    file.close()
    return opcodes

def run(program, noun, verb):
    program.initialize(None, None)
    program.poke(1, noun)
    program.poke(2, verb)

    program.execute(False)

    return program.peek(0)

def part1(program):
    answer = run(program, 12, 2)
    return answer

def part2(program):
    target = 19690720
    start = run(program, 0, 0)

    verb = (target-start) % 360000
    noun = int((target-start-verb) / 360000)

    if run(program, noun, verb) == target:
        return noun * 100 + verb

    return 0

print("")
print("*******************************")
print("* Advent of Code 2019 - Day 2 *")
print("*******************************")
print("")

program = IntCode('2019/data/day2.data')

print("Answer part 1 is", part1( program ))
print("Answer part 2 is", part2( program ))

print("")
