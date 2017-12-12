#include <ctype.h>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#include "parser.h"

void skipSpaces(char** input)
{
    char* ptr = *input;

    while (*ptr && isspace(*ptr))
        ptr++;

    *input = ptr;
}

char* getToken(char** input)
{
    skipSpaces(input);

    char* ptr = *input;
    char* token = NULL;
    if (*ptr && isalpha(*ptr))
    {
        char* start = ptr++;
        while (*ptr && isalnum(*ptr))
            ptr++;
        token = calloc(ptr-start+1, 1);
        memcpy(token, start, ptr-start);
    }
    *input = ptr;
    return token;
}

int getNumber(char** input)
{
    skipSpaces(input);

    int value = 0;
    char* ptr = *input;
    if (isdigit(*ptr))
    {
        while (isdigit(*ptr))
        {
            value = (value * 10) + (*ptr - '0');

            ptr++;
        }
    }

    *input = ptr;
    return value;
}

int expect(char** input, char c)
{    
    skipSpaces(input);
    char *ptr = *input;
    if (*ptr == c)
    {
        ptr++;
        *input = ptr;
        return 1;
    }
    else if (*ptr)
    {
        printf("expecting %c got %c\n", c, *ptr);
        return 0;
    }
    else
    {
        printf("expecting %c got nothing\n", c);
        return 0;
    }
}

int isEOL(char** input)
{
    skipSpaces(input);
    return **input == '\0';
}
