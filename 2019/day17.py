from IntCode import IntCode

def part1(program: IntCode) -> int:
    def input():
        while True:
            yield 0

    previousLine = []
    currentLine  = []
    y, total = 0, 0

    def output(ch: int) -> None:
        nonlocal previousLine, currentLine, y, total

        if ch == 10:
            y += 1
            print(''.join(currentLine))
            previousLine = currentLine
            currentLine  = []
        else:
            ch = chr(ch)
            currentLine.append(ch)
            x = len(currentLine)-1
            if y > 0 and ch != '.' and x > 1 and currentLine[x-1] != '.' and currentLine[x-2] != '.':
                if previousLine[x-1] != '.':
                    total += y * (x-1)
                    currentLine[x-1] = 'O'

    program.initialize(input(), output)
    program.execute(False)

    return total

def part2(program: IntCode) -> int:
    return 0

print("")
print("********************************")
print("* Advent of Code 2019 - Day 15 *")
print("********************************")
print("")

program = IntCode('2019/data/day17.data')

print("Answer part 1 is", part1(program))
print("Answer part 2 is", part2(program))