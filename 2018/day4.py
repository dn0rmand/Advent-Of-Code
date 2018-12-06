from parse import parse

def loadData():
    entries = []

    with open('2018/data/day4.data', 'rt') as data:
        for line in data:
            entries.append(line.strip())

    entries.sort()

    world = {}

    for line in entries:
        # Starts Shift
        data = parse("[{:d}-{:d}-{:d} {:d}:{:d}] Guard #{:d} begins shift", line)
        if not data is None:
            currentGuard = data[5]
            if not currentGuard in world:
                world[currentGuard] = [0]*60
            currentGuard = world[currentGuard]
            continue

        # Goes to Sleep
        data = parse("[{:d}-{:d}-{:d} {:d}:{:d}] falls asleep", line)
        if not data is None:
            sleepStart = data[4]
            continue

        # Goes to Sleep
        data = parse("[{:d}-{:d}-{:d} {:d}:{:d}] wakes up", line)
        if not data is None:
            sleepEnd = data[4] 
            for i in range(sleepStart, sleepEnd):
                currentGuard[i] += 1
            continue

    return world

def part1(input):
    max = 0
    guard = 0

    for k in input:
        sleep = sum(input[k])
        if sleep > max:
            guard = k
            max = sleep
    
    max = 0
    hour = 0
    w = input[guard]
    for h in range(0, 60):
        if w[h] > max:
            max = w[h]
            hour = h
    
    answer = guard * hour

    print("Answer part 1 is", answer)

def part2(input):
    max  = 0
    hour = 0
    guard= 0

    for g in input:
        w = input[g]
        for h in range(0, 60):
            if w[h] > max:
                max  = w[h]
                guard= g
                hour = h

    answer = guard * hour

    print("Answer part 2 is", answer)

print("")
print("*******************************")
print("* Advent of Code 2018 - Day 4 *")
print("*******************************")
print("")

input = loadData()
part1(input)
part2(input)

print("")
