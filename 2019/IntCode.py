from typing import Iterator, Callable
from collections import deque
from array import array
import curses

class IntCode:
    def __init__(self, filename: str = None) -> None:
        self.program    = []
        self.ip         = 0
        self.base       = 0
        self.lastInput  = None

        if not filename == None:
            with open(filename, 'rt') as data:
                for opcode in data.readline().split(','):
                    self.program.append(int(opcode))

    def save(self, filename: str) -> None:
        def pack(f):
            for c in self.memory:
                if c >= 0 and c < 256:
                    array('B', [c]).tofile(f)
                elif c < 0 and c > -128:
                    array('b', [c]).tofile(f)
                elif c > -32768 and c <= 32768:
                    array('i', [c]).tofile(f)
                else:
                    array('l', [c]).tofile(f)

        with open(filename, "wb") as data:
            pack(data)

    def clone(self):
        copy = IntCode()
        copy.program = self.program
        return copy

    def load(self) -> None:
        self.memory = [byte for byte in self.program]
        self.ip     = 0
        self.base   = 0

    def readNext(self) -> int:
        value = self.peek(self.ip)
        self.ip += 1
        return value

    def peek(self, address: int) -> int:
        if address < 0:
            raise Exception("invalid negative address")
        if address >= len(self.memory):
            extra = address+1-len(self.memory)
            self.memory.extend([0]*extra)
        return self.memory[address]

    def poke(self, address: int, value: int) -> None:
        if address < 0:
            raise Exception("invalid negative address")
        if address >= len(self.memory):
            extra = address+1-len(self.memory)
            self.memory.extend([0]*extra)

        self.memory[address] = value

    def getNextInstruction(self) -> (int, int, int, int):
        instruction = self.readNext()
        opcode = instruction % 100
        instruction = int((instruction-opcode)/100)

        modeA  = instruction % 10
        instruction = int((instruction-modeA)/10)
        modeB  = instruction % 10
        instruction = int((instruction-modeB)/10)
        modeC  = instruction % 10

        if not (modeA == 0 or modeA == 1 or modeA == 2):
            raise Exception("Mode not supported in IntCode")
        if not (modeB == 0 or modeB == 1 or modeB == 2):
            raise Exception("Mode not supported in IntCode")
        if not (modeC == 0 or modeC == 1 or modeC == 2):
            raise Exception("Mode not supported in IntCode")

        return (opcode, modeA, modeB, modeC)

    def readParameter(self, mode: int) -> int:
        address = self.readNext()
        if mode == 0:
            address = self.peek(address)
        elif mode == 2:
            address = self.peek(self.base+address)
        return address

    def writeParameter(self, mode: int, value: int) -> None:
        if not (mode == 0 or mode ==  2):
            raise Exception("Mode 1 not supported")
        address = self.readNext()
        if mode == 2:
            address += self.base
        self.poke(address, value)

    def step(self) -> int:
        opcode, mode1, mode2, mode3 = self.getNextInstruction()

        if opcode == 99: # halt
            self.ip = -1

        elif opcode == 1: # add
            a = self.readParameter(mode1)
            b = self.readParameter(mode2)

            self.writeParameter(mode3, a + b)

        elif opcode == 2: # multiply
            a = self.readParameter(mode1)
            b = self.readParameter(mode2)
            self.writeParameter(mode3, a * b)

        elif opcode == 3: # read input
            self.lastInput = next(self.input)
            self.writeParameter(mode1, self.lastInput)

        elif opcode == 4: # write output
            value = self.readParameter(mode1)
            self.output(value)

        elif opcode == 5: # jump if not 0
            v1 = self.readParameter(mode1)
            v2 = self.readParameter(mode2)
            if not v1 == 0:
                self.ip = v2

        elif opcode == 6: # jump if 0
            v1 = self.readParameter(mode1)
            v2 = self.readParameter(mode2)
            if v1 == 0:
                self.ip = v2

        elif opcode == 7: # less than
            v1 = self.readParameter(mode1)
            v2 = self.readParameter(mode2)
            self.writeParameter(mode3, 1 if v1 < v2 else 0)

        elif opcode == 8: # equals
            v1 = self.readParameter(mode1)
            v2 = self.readParameter(mode2)
            self.writeParameter(mode3, 1 if v1 == v2 else 0)

        elif opcode == 9: # adjusts the relative base
            v1 = self.readParameter(mode1)
            self.base += v1

        return opcode

    def initialize(self, input: Iterator[int], output: Callable[[int], None]) -> None:
        self.load()
        self.output = output
        self.input  = input

    def writeText(self, txt: str, scroll: bool) -> None:
        y,_ = self.stdscr.getmaxyx()
        if not scroll:
            if len(self.lines) > 0:
                self.lines.pop() # remove last one to replace it
        self.lines.append(txt)
        if len(self.lines) >= y:
            self.lines.popleft()

        y = 1
        for l in self.lines:
            self.stdscr.addstr(y, 1, l)
            self.stdscr.clrtoeol()
            y += 1
        self.stdscr.refresh()

    def Debug(self) -> None:

        def runLoop(stdscr) -> None:
            curses.curs_set(0)

            h,w = stdscr.getmaxyx()
            stdscr.addstr(1, 2, "INTCODE DEBUGGER - Enter to step, ESC to terminate")
            stdscr.hline(2,1, "-", w)
            stdscr.refresh()
            self.stdscr = stdscr.subwin(h-4, w-2, 3, 1)
            self.lines = deque()
            self.yline  = 0
            self.ip = 0
            self.base = 0
            while self.ip >= 0:
                op, txt = self.dump()
                self.writeText(txt, True)

                while True:
                    key = stdscr.getch()
                    if key == curses.KEY_ENTER or key in [10, 13]:
                        self.step()
                        if op == 3:
                            self.writeText(txt + " <- {0}".format(self.lastInput), False)
                        break

                    elif key == 27:
                        exit()

            while True:
                key = stdscr.getch()
                if key == 27:
                    break

            self.stdscr = None

        curses.wrapper(runLoop)

    def execute(self, debug: bool = False) -> None:
        if debug:
            self.Debug()
            return

        self.ip   = 0
        self.base = 0
        while self.ip >= 0:
            self.step()

    def parameter(self, mode: int) -> (str, int):
        value = self.readNext()
        if mode == 0:
            return ("[{0}]".format(value), self.peek(value))
        elif mode == 2:
            if value < 0:
                return ("[base-{0}]".format(-value), self.peek(self.base+value))
            else:
                return ("[base+{0}]".format(value), self.peek(self.base+value))
        else:
            return (str(value), value)

    def dump(self) -> int:
        oldip = self.ip

        opcode, mode1, mode2, mode3 = self.getNextInstruction()

        txtLine = "      ".format(oldip, opcode)

        if opcode == 99:
            txtLine += "HALT"

        elif opcode == 1:
            v1,v11 = self.parameter(mode1)
            v2,v22 = self.parameter(mode2)
            v3,v33 = self.parameter(mode3)
            sign = '+'
            if mode2 == 1 and int(v2) < 0:
                sign = '-'
                v2 = str(-int(v2))
            elif mode1 == 1 and int(v1) < 0:
                sign = str(-int(v1))
                v1 = v2
                v2 = sign
                sign = '-'

            if mode1 == 1 and v11 == 0:
                txtLine += "{0}  = {1}".format(v3, v2)
            elif mode2 == 1 and v22 == 0:
                txtLine += "{0}  = {1}".format(v3, v1)
            elif v3 == v2:
                txtLine += "{0} {3}= {1}".format(v3, v1, v2, sign)
            elif v3 == v1:
                txtLine += "{0} {3}= {2}".format(v3, v1, v2, sign)
            else:
                txtLine += "{0}  = {1} {3} {2}".format(v3, v1, v2, sign)

        elif opcode == 2:
            v1,v11 = self.parameter(mode1)
            v2,v22 = self.parameter(mode2)
            v3,_ = self.parameter(mode3)

            if (mode1 == 1 and v11 == 0) or (mode2 == 1 and v22 == 0):
                txtLine += "{0}  = 0".format(v3)
            elif mode1 == 1 and v11 == 1:
                txtLine += "{0}  = {1}".format(v3, v2)
            elif mode2 == 1 and v22 == 1:
                txtLine += "{0}  = {1}".format(v3, v1)
            elif v3 == v1:
                txtLine += "{0} *= {1}".format(v3, v2)
            elif v3 == v2:
                txtLine += "{0} *= {1}".format(v3, v1)
            else:
                txtLine += "{0}  = {1} * {2}".format(v3, v1, v2)

        elif opcode == 3:
            v1, _ = self.parameter(mode1)
            txtLine += "{0}  = INPUT()".format(v1)

        elif opcode == 4:
            v1, _ = self.parameter(mode1)
            txtLine += "OUTPUT({0})".format(v1)

        elif opcode == 5: # jump if true
            v1, v11 = self.parameter(mode1)
            v2, v22 = self.parameter(mode2)
            if mode1 == 1:
                if v11 != 0:
                    v2, format = (v2, "GOTO {0}") if mode2 != 1 else (int(v2), "GOTO {0}")
                    txtLine += format.format(v2)
                else:
                    txtLine += "NOP"
            elif mode2 == 1:
                v2=int(v2)
                txtLine += "IF {0} != 0 THEN GOTO {1}".format(v1, v2)
            else:
                txtLine += "IF {0} != 0 THEN GOTO {1} ".format(v1, v2)

        elif opcode == 6: # jump if false
            v1, v11 = self.parameter(mode1)
            v2, v22 = self.parameter(mode2)
            if mode1 == 1:
                if v11 == 0:
                    v2, format = (v2, "GOTO {0}") if mode2 != 1 else (int(v2), "GOTO {0}")
                    txtLine += format.format(v2)
                else:
                    txtLine += "NOP"
            elif mode2 == 1:
                v2=int(v2)
                txtLine += "IF {0} == 0 THEN GOTO {1}".format(v1, v2)
            else:
                txtLine += "IF {0} == 0 THEN GOTO {1}".format(v1, v2)

        elif opcode == 7: # less than
            v1, v11 = self.parameter(mode1)
            v2, v22 = self.parameter(mode2)
            v3, _   = self.parameter(mode3)
            if mode1 == 1 and mode2 == 1:
                if v11 < v22:
                    txt += "{0}  = 1".format(v3)
                else:
                    txt += "{0}  = 0".format(v3)
            else:
                txtLine += "{2}  = 1 IF {0} < {1} ELSE 0".format(v1, v2, v3)

        elif opcode == 8: # equals
            v1, v11 = self.parameter(mode1)
            v2, v22 = self.parameter(mode2)
            v3, _   = self.parameter(mode3)
            if mode1 == 1 and mode2 == 1:
                if v11 == v22:
                    txt += "{0}  = 1".format(v3)
                else:
                    txt += "{0}  = 0".format(v3)
            else:
                txtLine += "{2}  = 1 IF {0} == {1} ELSE 0".format(v1, v2, v3)

        elif opcode == 9: # adjusts the relative base
            v1, v11 = self.parameter(mode1)
            if mode1 == 1 and v11 < 0:
                txtLine += "base -= {0}".format(-v11)
            else:
                txtLine += "base += {0}".format(v1)

        else:
            txtLine += "unsupported opcode {0}".format(opcode)

        self.ip = oldip
        return opcode, txtLine
