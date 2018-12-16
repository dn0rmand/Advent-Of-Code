from time import time
from itertools import chain

def solve(elvePower):

    def loadData(lines):
        elves   = {}
        goblins = {}
        grid    = []

        y = -1
        for line in lines:
            line = line.strip()
            if not line: continue # ignore empty lines
            row = [c for c in line]
            grid.append(row)
            y += 1
            x = -1
            for c in row:
                x += 1
                if c == 'E':
                    elves[(y, x)] = 200
                elif c == 'G':
                    goblins[(y, x)] = 200

        return grid, elves, goblins

    grid, elves, goblins = loadData(open('2018/data/day15.data').readlines())
    hasPlayed = {}

    def getTarget(x, y, enemies):
        units = sorted([(enemies[u], u[0], u[1]) for u in ((y-1, x), (y, x-1), (y, x+1), (y+1, x)) if u in enemies])
        if len(units) == 0:
            return None

        t = units[0]
        # for u in units:
        #     if enemies[u] < enemies[t]:
        #         t = u

        return (t[1],t[2])

    def findTargets(x, y, enemy):
        visited  = {}
        states   = [(y, x, None, None)]
        found    = []

        def check(newStates, x1, y1, dx, dy):
            if (x1, y1) in visited: 
                return
            if dx == None:
                dx = x1
                dy = y1

            visited[(x1, y1)] = 1

            if grid[y1][x1] != '.':
                return
            if grid[y1-1][x1] == enemy or grid[y1][x1-1] == enemy or grid[y1][x1+1] == enemy or grid[y1+1][x1] == enemy:
                found.append((y1, x1, dy, dx))
            else:
                newStates.append((y1, x1, dy, dx))

        while len(states) > 0:
            newStates = []
            for state in states:
                x, y, dx, dy  = state[1], state[0], state[3], state[2]
                check(newStates, x, y-1, dx, dy)
                check(newStates, x-1, y, dx, dy)
                check(newStates, x+1, y, dx, dy)
                check(newStates, x, y+1, dx, dy)

            if len(found) > 0:
                break
            states = newStates
        if len(found) > 0:
            found = sorted(found)[0]
            return (found[2], found[3])
        else:
            return None

    def play(x, y):
        enemy, enemies,friends = ('G', goblins, elves) if grid[y][x] == 'E' else ('E', elves, goblins)

        target = getTarget(x, y, enemies)

        if target == None:
            # find targets
            u = findTargets(x, y, enemy)
            if u != None:
                # move 
                x2, y2 = u[1], u[0]
                friends[(y2, x2)] = friends[(y, x)]
                friends.pop((y, x))
                grid[y2][x2] = grid[y][x]
                grid[y][x]   = '.'
                hasPlayed[(y2, x2)] = 1
                target = getTarget(x2, y2, enemies)

        if target != None:            
            pwr = 3 if enemy == 'E' else elvePower
            enemies[target] = enemies[target] - pwr
            if enemies[target] <= 0:
                if enemy == 'E' and elvePower != 3:
                    raise Exception("E")

                enemies.pop(target)
                hasPlayed[target] = 1
                grid[target[0]][target[1]] = '.'

    rounds = 0

    while len(elves) > 0 and len(goblins) > 0:
        if rounds == 70:
            rounds = 70

        units = sorted([unit for unit in chain(elves, goblins)])
        hasPlayed.clear()
        for u in units:
            if u in hasPlayed:
                continue
            hasPlayed[u] = 1
            if grid[u[0]][u[1]] == '.': # dead
                continue
            if len(elves) == 0 or len(goblins) == 0:
                rounds -= 1
                break
            play(u[1], u[0])
        rounds += 1

    total = sum((elves[u] for u in elves)) + sum((goblins[u] for u in goblins))
    answer = total * rounds

    return answer

def part1():
    answer = solve(3)
    print("Answer to part 1 is", answer)

def part2():
    power = 3
    while True:
        try:
            power += 1
            answer = solve(power)
            break
        except Exception as error:
            if error.args[0] == 'E':
                pass        
    
    print("Answer to part 2 is", answer)

print("")
print("********************************")
print("* Advent of Code 2018 - Day 15 *")
print("********************************")
print("")

start = time()
part1()
end = time()
print("Part 1 executed in ", round((end-start)*1000), "ms")

start2 = time()
part2()
end = time()
print("Part 2 executed in ", round((end-start2)*1000), "ms")
print("Total time is", round((end-start)*1000), "ms")