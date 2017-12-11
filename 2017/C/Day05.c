#include <time.h>
#include <stdio.h>
#include <stdlib.h>

static int _input_1[1024];
static int _input_2[1024];
static int _count = 0;

static long solve(int* input, int part)
{
    long steps  = 0;
    int current = 0;

    while (current >= 0 && current < _count)
    {
        steps++;

        int offset = input[current];

        if (part == 2 && offset >= 3)
            input[current]--;
        else
            input[current]++;

        current += offset;
    }

    return steps;
}

static void loadData()
{
    FILE* file = fopen("Data/Day05.data", "r");

    if (file == NULL)
    {
        printf("File not found!\n");
		return;
    }
        
    static char buffer[32];

	int count = 0;
    while (! feof(file))
    {
        char* ptr = fgets(buffer, 32, file);
        int value = atoi(ptr);
		
		_input_2[count] =
        _input_1[count] = value;
		
		count++;
    }
	
	_count = count;
    fclose(file);
}

void day5(void)
{
	double ms = CLOCKS_PER_SEC / 1000;
	
	long start = clock();
	loadData();
	long end = clock();
	
	printf("Data loaded in %lf ms\n\n", (end-start) / ms);
	
	long result_1 = solve(_input_1, 1);
	long result_2 = solve(_input_2, 2);
	
	printf("%li steps for part 1 ( expected 318883 )\n", result_1);
    printf("%li steps for part 2 ( expected 23948711 )\n", result_2);
}
