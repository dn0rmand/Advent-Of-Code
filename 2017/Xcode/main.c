//
//  main.c
//  AdventOfCode
//
//  Created by Normand, Dominique (Warren) on 12/10/17.
//  Copyright © 2017 Normand. All rights reserved.
//

#include <stdio.h>
#include <time.h>

void day1(void);
void day2(void);
void day3(void);
void day4(void);
void day5(void);
void day6(void);
void day7(void);
void day9(void);

void Execute(int dayNumber, void (*day)(void))
{
	printf("Executing DAY %i\n", dayNumber);
	
	double ms = CLOCKS_PER_SEC / 1000;
	
	long start = clock();
	day();
	long end = clock();
	
	printf("DAY %i executed in %lf ms\n\n", dayNumber, (end-start) / ms);
}

int main(int argc, const char * argv[])
{
	Execute(1, day1);
	Execute(2, day2);
	Execute(3, day3);
	Execute(4, day4);
	Execute(5, day5);
	Execute(6, day6);
	Execute(7, day7);
	Execute(9, day9);
	
	printf("Press ENTER to finish");
	getchar();
	return 0;
}
