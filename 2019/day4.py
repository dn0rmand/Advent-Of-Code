MIN = 134564
MAX = 585159

def isValid(password, part):
    if password < MIN or password > MAX:
        return False

    previous = 0
    count    = 0

    while password > 0:
        y = password % 10
        password = int((password - y)/10)

        if y == previous:
            count += 1
            if part == 1 and count >= 2:
                return True
        else:
            if part == 2 and count == 2:
                return True
            count = 1
            previous = y

    if part == 2:
        return count == 2
    else:
        return count >= 2

def calculate(current, len, part):
    count = 0

    if len == 6:
        if isValid(current, part):
            return 1
        else:
            return 0

    first = current % 10
    last  = 9

    if current == 0:
        first = 1
        last  = 5

    # 134564
    if current == 1:
        first = 3
    elif current == 13:
        first = 4
    elif current == 134:
        first = 5
    elif current == 1345:
        first = 6

    # 585159
    if current == 5:
        last = 8
    elif current == 58:
        last = 5
    elif current == 585:
        last = 1
    elif current == 5851:
        last = 5

    for c in range(first, last+1):
        count += calculate(current * 10 + c, len+1, part)

    return count

def part1():
    return calculate(0, 0, 1)

def part2():
    return calculate(0, 0, 2)

print("")
print("*******************************")
print("* Advent of Code 2019 - Day 3 *")
print("*******************************")
print("")

print("Answer part 1 is", part1())
print("Answer part 2 is", part2())

print("")
