#include <stdio.h>
#include <time.h>

static int garbageCount = 0;

static int processGroups(char** line, int score);

static void processGarbage(char** line)
{
    if (**line == '<')
    {
        (*line)++;
        while (**line)
        {
            char c = *((*line)++);
            if (c == '!')
            {
                if (**line)
                    (*line)++;
            }
            else if (c == '>')
                break;
            else
                garbageCount++;
        }
    }
}

static int processGroup(char** line, int score)
{
    processGarbage(line);

    int count = 0;
    if (**line == '{')
    {
        (*line)++;
        count = score + processGroups(line, score+1);
        if (**line != '}')
            return -1;// Error
        (*line)++;

        processGarbage(line);
    }    
    return count;
}

static int processGroups(char** line, int score)
{
    int groupCount = processGroup(line, score);
    while (**line == ',')
    {
        (*line)++;
        int value = processGroup(line, score);
        if (value < 0)
            return -1; //Error
        groupCount += value;
    }

    return groupCount;
}

void day9(void)
{
    FILE* file = fopen("Data/Day09.data", "r");

    if (file == NULL)
    {
        printf("File not found!\n");
		return;
    }
        
    static char buffer[1024 *17]; // my input is 16K
    
    if (! feof(file))
    {
        char* line = fgets(buffer, sizeof(buffer), file);
        
        int lineValue = processGroups(&line, 1);        
        if (lineValue < 0)
            printf("Invalid input\n");
        else
        {
            printf("Part 1: line value = %i ( 11089 )\n", lineValue);
            printf("Part 2: garbage count = %i ( 5288 )\n", garbageCount);
        }
    }
}

