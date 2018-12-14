from time import time

def getDigits(value, minLength):
    digits = [value % 10]
    while value >= 10:
        value = value // 10
        digits.append(value % 10)
    while len(digits) < minLength:
        digits.append(0)
    digits.reverse()
    return digits

def doStep(elves, recipes):
    v = sum((recipes[i] for i in elves))
    digits = getDigits(v, 1)
    recipes += digits        
    for i in range(0, len(elves)):
        elves[i] = (elves[i] + recipes[elves[i]] + 1) % len(recipes) 

def dump(elves, recipes):
    s = ""
    for i in range(0, len(recipes)):
        if i == elves[0]:
            s += '(' + str(recipes[i]) + ')'
        elif i == elves[1]:
            s += '[' + str(recipes[i]) + ']'
        else:
            s += ' ' + str(recipes[i]) + ' '
    print(s)

def part1(length):
    elves   = [0, 1]
    recipes = [3, 7]

    while len(recipes) <= length+10:
        doStep(elves, recipes)

    answer = ''.join([str(d) for d in recipes[length:length+10]])
    print("Answer to part 1 is", answer)

def matches(recipes, code, offset):
    x = recipes[-6:]
    l = len(recipes)-1-offset
    if l < len(code):
        return False
    for i in range(0, len(code)):
        if code[-(1+i)] != recipes[l-i]:
            return False

    return True

def part2(code):
    code = getDigits(code, 5)

    elves   = [0, 1]
    recipes = [3, 7]
    while True:
        doStep(elves, recipes)
        # dump(elves, recipes)        
        if matches(recipes, code, 0):
            answer = len(recipes) - len(code)
            break
        elif matches(recipes, code, 1):
            answer = len(recipes) - len(code) - 1
            break

    print("Answer to part 2 is", answer)

part2(51589) #9
part2( 1245) #5
part2(92510) #18
part2(59414) #2018

start = time()
part1(909441)
end = time()
print("Part 1 executed in ", round((end-start)*1000), "ms")

start2 = time()
part2(909441)
end = time()
print("Part 2 executed in ", round((end-start2)*1000), "ms")
print("Total time is", round((end-start)*1000), "ms")