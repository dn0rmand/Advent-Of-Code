from collections import Counter
from itertools import combinations

try:
    from itertools import izip as zip
except:
    pass

def day2():
    def loadData():
        words = []
        for line in open('2018/data/day2.data', 'rt'):
            words.append(line.strip())        
        return words

    def part1(words):
        threes = 0
        twos = 0

        for word in words:
            cc = Counter(word)
            if 2 in cc.values(): twos+=1
            if 3 in cc.values(): threes+=1

        print("Answer part 1 is", (twos*threes))

    def part2(words):    
        for w1, w2 in combinations(words, 2):
            diffCount = 0
            answer = ""

            for a, b in zip(w1, w2):
                if a == b:
                    answer += a
                else:
                    diffCount += 1
                    if diffCount > 1:
                        break

            if diffCount < 2:
                print("Answer part 2 is", answer)
                return

        print("Answer part 2 is not found")

    print("")
    print("*******************************")
    print("* Advent of Code 2018 - Day 2 *")
    print("*******************************")
    print("")

    words = loadData()
    part1(words)
    part2(words)

    print("")
