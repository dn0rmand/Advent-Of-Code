import time

def loadData(prefix: str):
    prefix = "--- " + prefix + " ---"
    with open("2019/Data/day16.data", 'rt') as file:
        foundPrefix = False
        for line in file:
            line = line.strip('\n')
            if not foundPrefix:
                if line == prefix:
                    foundPrefix = True
            else:
                values = [int(c) for c in line]
                return values

    raise Exception(f"No data for {prefix}")

def getData(data, repeat):
    for _ in range(0, repeat):
        yield from data

buffer1 = []
buffer2 = []

sumCache = None

def initBuffers(data) -> None:
    global buffer1, buffer2, sumCache

    sumCache = None
    buffer1 = [a for a in data]
    buffer2 = [0]*len(buffer1)
    return buffer1, len(buffer1)

def buildSums(data, offset) -> [int]:
    global sumCache

    size = len(data)
    if sumCache == None:
        sumCache = [0]*(size-offset)

    total = 0
    for i in range(size-1, offset-1, -1):
        total += data[i]
        sumCache[i-offset] = total

def processPhase(data, size, repeat, phase, offset) -> [int]:

    buildSums(data, offset)

    def getSum(start, end):
        if start >= size:
            return 0
        total = sumCache[start-offset]
        if end < size:
            total -= sumCache[end-offset]
        return total

    destin = buffer1 if data == buffer2 else buffer2
    realSize = size / repeat

    for i in range(0, size):
        if i < offset:
            continue

        digit = 0
        steps = (i+1)*4
        j1 = i
        j2 = i + steps//2
        start = j1

        while j1 < size:
            if j1 > start and (j1 % realSize) == start:
                count = (size-j1) // steps
                j1 += (count*steps)
                j2 += (count*steps)
                digit *= count

            j11 = min(size, j1+i+1)
            j22 = min(size, j2+i+1)
            digit += getSum(j1, j11) - getSum(j2, j22)
            j1 += steps
            j2 += steps

        destin[i] = abs(digit) % 10

    return destin

def execute(data, offset, repeat) -> int:

    data, size = initBuffers(getData(data, repeat))

    for phase in range(0, 100):
        data = processPhase(data, size, repeat, phase, offset)

    answer = 0

    for digit in data[offset:offset+8]:
        answer = (answer * 10) + digit

    return answer

def part1(data: [int]) -> int:
    return execute(data, 0, 1)

def part2(data: [int]) -> int:
    offset = 0
    for digit in data[:7]:
        offset = (offset * 10) + digit

    return execute(data, offset, 10000)

def runTest(name: str, expected1: int, expected2: int = None) -> None:
    data = loadData(name)
    if expected1 != None:
        assert part1(data) == expected1
    if expected2 != None:
        assert part2(data) == expected2
    print(name, "passed")

print("")
print("********************************")
print("* Advent of Code 2019 - Day 16 *")
print("********************************")
print("")

runTest("TEST1", 24176176)
runTest("TEST2", 73745418)
runTest("TEST3", 52432133)

t = time.perf_counter()
runTest("TEST4", None, 84462026)
t =  int((time.perf_counter()-t)*1000)
print(f"TEST4 executed in {t}ms")

puzzle = loadData("PUZZLE")

t = time.perf_counter()
print("Answer part 1 is", part1(puzzle))
t =  int((time.perf_counter()-t)*1000)
print(f"Part 1 executed in {t}ms")
t = time.perf_counter()
print("Answer part 2 is", part2(puzzle))
t =  int((time.perf_counter()-t)*1000)
print(f"Part 2 executed in {t}ms")

print("")