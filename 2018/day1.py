def day1():
    def loadData():
        frequencies = []
        data = open('2018/data/day1.data', 'rt')

        line = data.readline()
        while line:
            delta = int(line)
            frequencies.append(delta)
            line = data.readline()

        data.close()
        return frequencies

    def part1(frequencies):
        frequency = sum(frequencies)
        print("Answer part 1 is", frequency)

    def part2(frequencies):
        processed = {0}
        frequency  = 0
        found      = False

        while not found:
            for delta in frequencies:
                frequency = frequency+delta
                if frequency in processed:
                    found  = True
                    break
                else:
                    processed.add(frequency)

        print("Answer part 2 is", frequency)

    print("")
    print("*******************************")
    print("* Advent of Code 2018 - Day 1 *")
    print("*******************************")
    print("")

    frequencies = loadData()
    part1(frequencies)
    part2(frequencies)

    print("")
