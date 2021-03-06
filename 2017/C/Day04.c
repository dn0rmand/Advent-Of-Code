#include <ctype.h>
#include <time.h>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>

static void printValid(int validCount)
{
    fprintf(stdout, "%i valid passphrase\n", validCount);
}

static char*	wordMap[500];
static int		wordCount = 0;

static int addWord(char* word)
{
    for(int i = 0; i < wordCount; i++)
    {
        if (strcmp(word, wordMap[i]) == 0)
        {
            // fprintf(stderr, "%s == %s\n", word, wordMap[i]);
            return 0;
        }
    }

    wordMap[wordCount++] = word;
    return 1;
}

static int cmpfunc(const void * a, const void * b)
{
   return ( *(char*)a - *(char*)b );
}

static void solve(int sort)
{
    FILE* file = fopen("Data/Day04.data", "r");

    if (file == NULL)
    {
        fprintf(stderr, "File not found!");
		return;
    }
        
    char buffer[1024];
    int  validCount = 0;
    
    while (! feof(file))
    {
        char* ptr = fgets(buffer, 1024, file);
        char* start = NULL;

        int isValid = 1;

        wordCount = 0;
        int len = 0;
        while (*ptr)
        {
            if (*ptr == '*')
            {
                isValid = 0;
                printValid(validCount);
                validCount = 0;
                break; 
            }
            if (isspace(*ptr++))
            {
                if (start != NULL)
                {
                    *(ptr-1) = '\0';

                    if (sort)
                    {
                        qsort(start, len, 1, cmpfunc);
                    }
                    if (! addWord(start))
                    {
                        isValid = 0;
                        break;
                    }
                    start = NULL;
                }
            }
            else if (start == NULL)
            {
                start = ptr-1;
                len = 1;
            }
            else
                len++;
        }

        if (isValid)
            validCount++;
    }
    fclose(file);
    printValid(validCount);
}

void day4(void)
{
	solve(0);
	solve(1);
}
