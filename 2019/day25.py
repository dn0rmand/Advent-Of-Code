from IntCode import IntCode


def part1(program: IntCode) -> str:

    currentString = ""
    answer = 0

    startMark = "Oh, hello! You should be able to get in by typing"
    endMark   = "on the keypad at the main airlock."

    def outputText(code: int) -> None:
        nonlocal currentString, answer

        if code == 10:
            start = currentString.find(startMark)
            end   = currentString.find(endMark)
            if start >= 0 and end >= start:
                s = currentString[start+len(startMark):end]
                answer = int(s)
            currentString = ""
        else:
            currentString += chr(code)


    commands = [
        "north",
        # "take astronaut ice cream",
        "south",
        "west",
        "take mouse",
        "north",
        # "take ornament",
        "west",
        "north",
        # "take easter egg",
        "north",
        "west",
        "north",
        "take wreath",
        "south",
        "east",
        "south",
        "east",
        "take hypercube",
        "north",
        "east",
        "take prime number",
        "west",
        "south",
        "west",
        "south",
        "west",
        "west",
        "north"
    ]

    def inputCommands():

        def sendCommand(cmd: str):
            for c in cmd:
                yield ord(c)
            yield 10

        for cmd in commands:
            yield from sendCommand(cmd)

        while True:
            cmd = input("")
            yield from sendCommand(cmd)

    program.initialize(inputCommands(), outputText)
    program.execute(False)

    return answer

print("")
print("********************************")
print("* Advent of Code 2019 - Day 25 *")
print("********************************")
print("")

program = IntCode('2019/data/day25.data')

print("Answer part 1 is", part1(program))

"""
   ####    ##########
   #10#    # 3  2   #
 ###  ########## ####
 #9     ##12 13#1#
 ###### ##  #  # #
 #C#  #8  11#  # #
 # #### #####  # #
 #  7  6  5#   # #
########## ##### #
         #4     X#
         #########

C = checkpoint
    mug => too heavy.
    ornament + astronaut ice cream + mouse + wreath + easter egg => too light
    hypercube + prime number + mouse + easter egg => too heavy
    hypercube + prime number + mouse  => too light

X = starting point
1 = astronaut ice cream
2 = photons <- Don't take this ... killer
3 = molten lava <- Don't take this ... killer
4 = mouse
5 = ornament
6 = giant electromagnet <- Don't take this ... killer
7 = mug
8 = easter egg
9 = escape pod <- Don't take this ... killer
10= wreath
11= hypercube
12= infinite loop <- Don't take this ... killer
13= prime number

"""