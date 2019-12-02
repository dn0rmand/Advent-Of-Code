def loadData():
    opcodes = []
    file = open('2019/data/day2.data', 'rt')

    data = file.readline().split(',')

    for opcode in data:
        opcodes.append(int(opcode))

    file.close()
    return opcodes

def run(program, noun, verb):

    memory = [opcode for opcode in program]
    memory[1] = noun
    memory[2] = verb

    position = 0
    opcode = memory[position]
    while opcode != 99:
        if opcode != 1 and opcode != 2:
            raise Exception("Invalid opcode")

        p1 = memory[position+1]
        p2 = memory[position+2]
        p3 = memory[position+3]
        if opcode == 1:
            memory[p3] = memory[p1] + memory[p2]
        else:
            memory[p3] = memory[p1] * memory[p2]

        position += 4
        opcode = memory[position]

    return memory[0]

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

program = loadData()

print("Answer part 1 is", part1( program ))
print("Answer part 2 is", part2( program ))

print("")
