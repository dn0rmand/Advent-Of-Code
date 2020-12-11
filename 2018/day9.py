from collections import defaultdict
from collections import deque
from time import time

def day9():
    def loadData():
        data = open('2018/data/day9.data', 'rt').readline().strip().split()
        return int(data[0]), int(data[6])

    def solve(players, maxMarble):
        scores  = defaultdict(int)
        marbles = deque([0])

        player  = 0
        count   = 0
        hiscore = 0

        for marble in range(1, maxMarble+1):
            count += 1
            if count == 23:
                count = 0
                player += 23
                while player >= players: 
                    player -= players
                marbles.rotate(-7)
                scores[player] += marble + marbles.popleft()
                if scores[player] > hiscore:
                    hiscore = scores[player]
                marbles.rotate(1)
            else:
                marbles.rotate(1)
                marbles.appendleft(marble)

        return hiscore

    def part1(players, max):
        answer = solve(players, max)
        print("Answer part 1 is", answer)

    def part2(players, max):
        answer = solve(players, max * 100)
        print("Answer part 2 is", answer)

    print("")
    print("*******************************")
    print("* Advent of Code 2018 - Day 9 *")
    print("*******************************")
    print("")

    assert solve(10, 1618) == 8317
    assert solve(13, 7999) == 146373
    assert solve(17, 1104) == 2764
    assert solve(21, 6111) == 54718
    assert solve(30, 5807) == 37305

    player, maxMarble = loadData()
    part1(player, maxMarble)
    start = time()
    part2(player, maxMarble)
    end = time()
    print(end-start)