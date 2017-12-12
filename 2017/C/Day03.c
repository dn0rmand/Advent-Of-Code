#include <stdio.h>
#include <string.h>
#include <ctype.h>

#define PUZZLE_INPUT	325489

typedef enum {
	RIGHT,
	UP,
	LEFT,
	DOWN
} Direction;

static Direction	direction;
static int			x;
static int			y;
static int 			min;
static int			max;

static void reset(void)
{
	x=0;
	y=0;
	min=0;
	max=0;
	direction=RIGHT;
}

static void move(void)
{
	int done = 0;
	
	while (! done)
	{
		done = 1;
		switch (direction)
		{
			case RIGHT:
				x++;
				if (x > max)
				{
					max++;
					min--;
					direction=UP;
				}
				break;
			case UP:
				if (y > min)
				{
					y--;
				}
				else
				{
					direction = LEFT;
					done = 0;
				}
				break;
			case LEFT:
				if (x > min)
				{
					x--;
				}
				else
				{
					direction = DOWN;
					done = 0;
				}
				break;
			case DOWN:
				if (y < max)
				{
					y++;
				}
				else
				{
					direction = RIGHT;
					done = 0;
				}
		}
	}
}

static void Solve1(void)
{
	reset();
	
	int current= 1;
	
	while (current != PUZZLE_INPUT)
	{
		move();
		current++;
	}
	if (x < 0) x = -x;
	if (y < 0) y = -y;
	
	int steps = x+y;
	printf("Part 1: Position of %i is { %i, %i }, %i (552) steps away from 1\n", PUZZLE_INPUT, x, y, steps);
}

#define MEM_SIZE	10

static void Solve2(void)
{
	int	memory[MEM_SIZE*2][MEM_SIZE*2];
	
	memset(memory, 0, sizeof(memory));
	
	reset();
	
	memory[x+MEM_SIZE][y+MEM_SIZE] = 1;
	
	while (1)
	{
		move();
		
		int xx = x + MEM_SIZE;
		int yy = y + MEM_SIZE;
		
		int value = memory[xx][yy-1] + memory[xx][yy+1] +
					memory[xx-1][yy] + memory[xx-1][yy-1] + memory[xx-1][yy+1] +
					memory[xx+1][yy] + memory[xx+1][yy-1] + memory[xx+1][yy+1];

		if (value > PUZZLE_INPUT)
		{
			printf("Part 2: Value is %i ( 330785 ) at position { %i, %i }\n", value, x, y);
			break;
		}
		else
			memory[xx][yy] = value;
	}
}

void day3(void)
{
	Solve1();
	Solve2();
}

