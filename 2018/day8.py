def day8():
    def loadData(input):
        data = [int(v) for v in input.strip().split()]
        return data

    def readNode1(input):
        nodes, metadatas = input[:2]
        input = input[2:]

        total = 0
        for _ in range(0, nodes):
            value, input = readNode1(input)
            total += value

        total += sum(input[:metadatas])

        return total, input[metadatas:]

    def part1(input):
        total, _ = readNode1(input)
        print("Answer part 1 is", total)

    def readNode2(input):
        nodes, metadatas = input[:2]
        input = input[2:]

        total = 0
        if nodes > 0:
            values = []
            for _ in range(0, nodes):
                value, input = readNode2(input)
                values.append(value)

            total += sum(( values[m-1] for m in input[:metadatas] if m > 0 and m <= nodes ))
            input = input[metadatas:]
        else:
            total += sum(input[:metadatas])
            input = input[metadatas:]

        return total, input

    def part2(input):
        total = 0
        while input:
            value, input = readNode2(input)
            total += value
        print("Answer part 2 is", total)

    print("")
    print("*******************************")
    print("* Advent of Code 2018 - Day 8 *")
    print("*******************************")
    print("")

    print("Test input")
    input = loadData("2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2")
    part1(input)
    part2(input)

    print("Real input")
    input = loadData(open('2018/data/day8.data', 'rt').readline())
    part1(input)
    part2(input)
