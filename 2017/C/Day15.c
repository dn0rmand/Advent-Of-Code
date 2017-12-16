#include <stdio.h>
#include <time.h>
#include <sys/types.h>
#include <unistd.h>
#include <sys/wait.h>

static long divider = 2147483647;

static long modulo(long value)
{
	long v = (value & divider) + (value >> 31);
	return (v >= divider) ? v - divider : v;
//	return value % divider;
}

static int solve1()
{
	int matches = 0;
	unsigned long A = 722;
	unsigned long B = 354;
	int count = 40000000;
	
	while (count-- > 0)
	{
		A = modulo(A * 16807);// % 2147483647;
		B = modulo(B * 48271);// % 2147483647;
		
		if ((A & 0xFFFF) == (B & 0xFFFF))
			matches++;
	}
	
	return matches;
}

static int solve2()
{
	int matches = 0;
	unsigned long A = 722;
	unsigned long B = 354;
	int count = 5000000;
	
	while (count-- > 0)
	{
		do
		{
			A = modulo(A * 16807);// % 2147483647;
		}
		while ((A & 3) != 0);
		
		do
		{
			B = modulo(B * 48271);// % 2147483647;
		}
		while ((B & 7) != 0);
		
		if ((A & 0xFFFF) == (B & 0xFFFF))
			matches++;
	}
	
	return matches;
}

void day15(void)
{
	pid_t pid = fork();
	
	if (pid > 0) // The parent
	{
		printf("Part 1: %i\n", solve1());
		
		int status;
		waitpid(pid, &status, 0);
	}
	else if (pid == 0) // the child
	{
		printf("Part 2: %i\n", solve2());
		exit(0);
	}
	else
		printf("Fork failed!\n");
}

