def loadData():
    frequencies = []
    data = open('2018/data/day1.data', 'rt') #, os.O_RDONLY)

    line = data.readline().strip()
    while line:
        delta = int(line)
        frequencies.append(delta)
        line = data.readline().strip()

    data.close()
    return frequencies

def part1(frequencies):
    frequency = 0
    for delta in frequencies:
        frequency = frequency+delta
    print("Answer part 1 is", frequency)

def part2(frequencies):
    duplicates = {0}
    frequency = 0
    found  = False

    while found == False:
        for delta in frequencies:
            frequency = frequency+delta
            if frequency in duplicates:
                found  = True
                answer = frequency
                break
            else:
                duplicates.add(frequency)

    print("Answer part 2 is", frequency)

frequencies = loadData()

part1(frequencies)
part2(frequencies)
