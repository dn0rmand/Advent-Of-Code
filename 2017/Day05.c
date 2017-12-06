#include <time.h>
#include <stdio.h>
#include <stdlib.h>

static int _input_1[1010];
static int _input_2[1010];
static int _count = 0;

static long solve(int* input, int part) 
{
    register long steps  = 0;
    register int current = 0;

    while (current >= 0 && current < _count)
    {
        steps++;

        register int offset = input[current];

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
    }
        
    static char buffer[1024];
    
    while (! feof(file))
    {
        char* ptr = fgets(buffer, 1024, file);
        int value = atoi(ptr);

        _input_1[_count] = _input_2[_count] = value;

        _count++;
    }
    fclose(file);
}

int main() 
{
    clock_t start_t = clock();

    loadData();

    long result_1 = solve(_input_1, 1);
    long result_2 = solve(_input_2, 2);

    clock_t end_t = clock();

    printf("%li steps for part 1 ( expected 318883 )\n", result_1);
    printf("%li steps for part 2 ( expected 23948711 )\n", result_2);
    
    double total = (double)(end_t - start_t) / CLOCKS_PER_SEC;

    printf("Executed in %lf seconds\n", total);
}

