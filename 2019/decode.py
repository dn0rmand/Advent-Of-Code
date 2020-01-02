from IntCode import IntCode
from IntCodeDecoder import IntCodeDecoder
import sys

DAY = 21 if len(sys.argv) <= 1 else int(sys.argv[1])

program = IntCode(f"2019/Data/day{DAY}.data")
program = IntCodeDecoder(program)

program.decode()
