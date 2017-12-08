#include <ctype.h>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define MAX_NAME_SIZE   20

typedef struct Program_s  
{
    char*               name;
    int                 weight;
    int                 totalWeight;  
    int                 balanced;  
    struct Program_s*   parent;
    struct Program_s*   child;
    struct Program_s*   sibling;
} Program;

Program*    _programs[2000];
int         _programCount = 0;

static Program* createProgram(char* name)
{
    Program* p = (Program*) malloc(sizeof(Program));

    p->name = name;
    p->weight = 0;
    p->totalWeight = 0;
    p->balanced = -1; // NOT SET
    p->parent   = NULL;
    p->child    = NULL; 
    p->sibling  = NULL;

    _programs[_programCount++] = p;

    return p;
}

static Program* getProgram(char *name)
{
    Program* p;

    for(int i = 0; i < _programCount; i++)
    {
        p = _programs[i];

        if (strcmp(p->name, name) == 0)
            return p;
    }
    
    return createProgram(name);
}

static void skipSpaces(char** input)
{
    char* ptr = *input;

    while (*ptr && isspace(*ptr))
        ptr++;

    *input = ptr;
}

static char* getToken(char** input)
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

static int getNumber(char** input)
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

static int expect(char** input, char c)
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

static int isEOL(char** input)
{
    skipSpaces(input);
    return **input == '\0';
}

static int parse() 
{
    FILE* file = fopen("../Data/Day07.data", "r");

    if (file == NULL)
    {
        printf("File not found!\n");
    }
        
    static char buffer[1024];
    
    while (! feof(file))
    {
        char*       line = fgets(buffer, 1024, file);
        char*       name = getToken(&line);
        Program*    program = getProgram(name);

        if (! expect(&line, '('))
            return 0;
        program->weight = getNumber(&line);
        if (! expect(&line, ')'))
            return 0;

        if (! isEOL(&line))
        {
            if (! expect(&line, '-'))
                return 0;
            if (! expect(&line, '>'))
                return 0;

            name = getToken(&line);

            Program* child = getProgram(name);

            child->parent = program;
            child->sibling = program->child;
            program->child = child;

            while (! isEOL(&line))
            {
                expect(&line, ',');
                name = getToken(&line);

                child = getProgram(name);

                child->parent = program;
                child->sibling = program->child;
                program->child = child;
            }
        }
    }

    return 1;
}

static Program* findRoot()
{
    Program* root = NULL;
    for(int i = 0; i < _programCount; i++)
    {
        Program* p = _programs[i];
        if (p->parent == NULL)
        {
            if (root == NULL)
            {
                root = p;
            }
            else
            {
                printf("Multiple roots\n");
                return NULL;
            }
        }
    }
    if (root == NULL)
        printf("No root\n");
    return root;
}

static void execute() 
{
    if (!parse())
    {
        printf("Failed to parse input\n");
        return;
    }
    Program* root = findRoot();
    if (root == NULL)
        return;

    printf("Part 1: %s\n", root->name);
}

int main() 
{
    double ms = CLOCKS_PER_SEC / 1000;

    long start = clock();    
    execute();
    long end = clock();

    printf("executed in %lf ms\n", (end-start) / ms);
}