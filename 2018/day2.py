def loadData():
    words = []
    data = open('2018/data/day2.data', 'rt')

    word = data.readline().strip()
    while word:
        words.append(word)
        word = data.readline().strip()

    data.close()
    return words

def part1(words):
    threes = 0
    twos = 0

    for word in words:
        counts = {}
        for c in word:
            if c in counts:
                counts[c] += 1
            else:
                counts[c] = 1
        hasThree = False
        hasTwo   = False
        for k in counts:
            if counts[k] == 2:
                hasTwo = True
            if counts[k] == 3:
                hasThree = True

        if hasThree: threes += 1
        if hasTwo: twos += 1

    print("Answer part 1 is", (twos*threes))

def part2(words):    
    answer = ""

    for i in range(len(words)):
        word1 = words[i]

        for j in range(i+1, len(words)):
            word2 = words[j]
            diffCount = 0
            diffIndex = -1

            for x in range(len(word1)):
                if word1[x] != word2[x]:
                    diffCount += 1
                    if diffCount > 1:
                        break
                    diffIndex = x

            if diffCount < 2:
                answer = word1[0:diffIndex] + word1[diffIndex+1:len(word1)]
                break

        if len(answer) > 0:
            break

    print("Answer part 2 is", answer)

print("")
print("*******************************")
print("* Advent of Code 2018 - Day 2 *")
print("*******************************")
print("")

words = loadData()
part1(words)
part2(words)

print("")
