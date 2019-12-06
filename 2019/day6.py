import math

def loadData():
    orbits = {}
    orbited= {}

    data = open('2019/data/day6.data', 'rt')

    line = data.readline().strip()
    while line:
        center, orbit = line.split(')')
        orbits[orbit] = center
        l = orbited.get(center)
        if l == None:
            l = []
            orbited[center] = l
        l.append(orbit)

        line = data.readline().strip()

    data.close()
    return orbits, orbited

def part1(orbits):
    visited = {}

    def countOrbits(value, visited):
        if visited.get(value) != None:
            return visited.get(value)
        center = orbits.get(value)
        count = 0
        if not center == None:
            count = 1 + countOrbits(center, visited)
        visited[value] = count
        return count

    answer = 0
    for c in orbits.keys():
        answer += countOrbits(c, visited)

    return answer

def part2(orbits, orbited):
    answer = 0

    start = orbits.get('YOU')
    end   = orbits.get('SAN')
    if start == None or end == None:
        raise Exception('No fair')

    if start == end:
        return 0

    states = [start]
    visited= {}
    visited[start] = 1
    visited['YOU'] = 1
    visited['SAN'] = 1

    moves = 0
    while True:
        moves += 1
        newStates = {}
        for s in states:
            t = orbits.get(s)
            if not t == None:
                if visited.get(t) == None:
                    newStates[t] = 1
                    visited[t] = 1

            if not orbited.get(s) == None:
                for t in orbited.get(s):
                    if visited.get(t) == None:
                        newStates[t] = 1
                        visited[t] = 1

        if newStates.get(end) != None:
            break
        states = newStates.keys()

    return moves

print("")
print("*******************************")
print("* Advent of Code 2019 - Day 6 *")
print("*******************************")
print("")

orbits, orbited = loadData()
print("Answer part 1 is", part1(orbits))
print("Answer part 2 is", part2(orbits, orbited))

print("")
