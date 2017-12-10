//#include <ctype.h>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define INPUT_SIZE      16
#define HASHTABLE_SIZE  1000

static int puzzleInput[INPUT_SIZE] = { 4, 10, 4, 1, 8, 4, 9, 14, 5, 1, 14, 15, 0, 15, 3, 5 };

typedef struct ENTRY_S
{
    int         	value[INPUT_SIZE];
    int         	step;
	struct ENTRY_S* next;
} ENTRY;

static ENTRY*   hashTable[HASHTABLE_SIZE];

static int makeHash(int* input)
{
    unsigned long hash = 0;

    for(int i = 0; i < INPUT_SIZE; i++)
    {
        hash = (hash << 6) | input[i];
    }

    return hash % HASHTABLE_SIZE;
}

static int saveState(int step)
{
    int hash = makeHash(puzzleInput);

    ENTRY* previous = hashTable[hash];

    if (previous != NULL)
    {
        for (ENTRY* c = previous; c != NULL; c = c->next)
        {
            if (memcmp(puzzleInput, c->value, sizeof(puzzleInput)) == 0)
            {
                return c->step;
            }
        }
    }

    ENTRY* entry = (ENTRY*) malloc(sizeof(ENTRY));

    memcpy(entry->value, puzzleInput, sizeof(puzzleInput));
    entry->step = step;
    entry->next = previous;
    hashTable[hash] = entry;

    return 0;
}

static void solve()
{
    int  steps = 0;
    int  size = 0;
    int  count = INPUT_SIZE;

    while (1)
    {
        steps++;

        // Find Max value

        int max   = -1;
        int index = -1;

        for(int i = 0; i < count; i++)
        {
            if (puzzleInput[i] > max)
            {
                max = puzzleInput[i];
                index = i;
            }
        }

        // Redistribute

        puzzleInput[index] = 0;
        while (max--)
        {
            index = (index + 1) % count;

            puzzleInput[index]++;
        }

        // Remember array

        int previous = saveState(steps);

        if (previous > 0)
        {
            size = steps - previous;
            break;
        }
    }

    printf("PART 1: %i steps ( 12841 )\n", steps);
    printf("PART 2: Size of %i ( 8038 )\n", size);
}

int day6(void)
{
    double ms = CLOCKS_PER_SEC / 1000;

    long start = clock();    
    solve();
    long end = clock();

    printf("executed in %lf ms\n", (end-start) / ms);
	return 0;
}
