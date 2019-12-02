import math

def loadData():
    input = []
    data = open('2019/data/day1.data', 'rt')

    line = data.readline()
    while line:
        mass = int(line)
        input.append(mass)
        line = data.readline()

    data.close()
    return input

def part1(masses):
    answer = 0
    for mass in masses:
        answer += math.floor(mass/3) - 2
    return answer

def getFuel(mass):
    if mass < 1:
        return 0
    fuel = math.floor(mass/3) - 2
    if fuel < 1:
        fuel = 0
    return fuel + getFuel(fuel)

def part2(masses):
    answer = 0
    for mass in masses:
        answer += getFuel(mass)
    return answer

print("")
print("*******************************")
print("* Advent of Code 2019 - Day 1 *")
print("*******************************")
print("")

masses = loadData()
print("Answer part 1 is", part1(masses))
print("Answer part 2 is", part2(masses))

print("")
