from IntCode import IntCode
from IntCodeDecoder import IntCodeDecoder

program = IntCode('2019/Data/day21.data')
program = IntCodeDecoder(program)

program.decode()
