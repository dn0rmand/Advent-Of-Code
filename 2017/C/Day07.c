#include <ctype.h>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include "parser.h"

#define MAX_NAME_SIZE   20

typedef struct PROGRAM_S
{
    char*               name;
    int                 weight;
    int                 totalWeight;  
    int                 balanced;  
    int                 expectedWeigth;
    struct PROGRAM_S*   parent;
    struct PROGRAM_S*   child;
    struct PROGRAM_S*   sibling;
} PROGRAM;

static PROGRAM*    programs[2000];
static int         programCount = 0;

static PROGRAM* createProgram(char* name)
{
    PROGRAM* p = (PROGRAM*) malloc(sizeof(PROGRAM));

    p->name = name;
    p->weight = 0;
    p->totalWeight = 0;
    p->balanced = -1; // NOT SET
    p->parent   = NULL;
    p->child    = NULL; 
    p->sibling  = NULL;

    programs[programCount++] = p;

    return p;
}

static PROGRAM* getProgram(char *name)
{
    PROGRAM* p;

    for(int i = 0; i < programCount; i++)
    {
        p = programs[i];

        if (strcmp(p->name, name) == 0)
            return p;
    }
    
    return createProgram(name);
}

static int parse() 
{
    FILE* file = fopen("Data/Day07.data", "r");

    if (file == NULL)
    {
        printf("File not found!\n");
		return 0;
    }
        
    static char buffer[1024];
    
    while (! feof(file))
    {
        char*       line = fgets(buffer, 1024, file);
        char*       name = getToken(&line);
        PROGRAM*    program = getProgram(name);

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

            PROGRAM* child = getProgram(name);

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

static PROGRAM* findRoot()
{
    PROGRAM* root = NULL;
    for(int i = 0; i < programCount; i++)
    {
        PROGRAM* p = programs[i];
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

static int calculateWeight(PROGRAM* program)
{
    int weight = program->weight;

    for (PROGRAM* child = program->child; child != NULL; child = child->sibling)
    {
        weight += calculateWeight(child);
    }

    program->totalWeight = weight;

    return weight;
}

static int checkIfBalanced(PROGRAM* program)
{
    if (program->balanced != -1) // SET?
        return program->balanced;    

    PROGRAM* parent = program->parent;
    if (parent == NULL || (parent->child == program && program->sibling == NULL)) // No parent or no siblings
    {
        program->balanced = 1;
        return 1;
    }

    // Check if at least one other sibling has the same total weight

    int referenceWeight = -1;
    int childCount = 0;

    for(PROGRAM* sibling = parent->child; sibling != NULL; sibling = sibling->sibling)
    {
        if (sibling == program) // It's me ... skip it
            continue;
        childCount++;
        if (sibling->totalWeight == program->totalWeight)
        {
            program->balanced = 1;
            return 1;
        }
        else
            referenceWeight = sibling->totalWeight;
    }

    if (childCount > 1) // 2 or more siblings, must be not balanced
    {
        program->balanced = 0;
        program->expectedWeigth = program->weight - program->totalWeight + referenceWeight;
        return 0;
    }
    else if (childCount == 1)
    {
        // Assume balanced

        program->balanced = 0;
        program->expectedWeigth = program->weight - program->totalWeight + referenceWeight;

        // but check the sub programs

        for(PROGRAM* child = program->child; child != NULL; child = child->sibling)
        {
            if (! checkIfBalanced(child))
                return 0;
        }

        program->balanced = 1;
        return 1;
    }
    else
    {
        program->balanced = 1;
        return 1;
    }
}

static PROGRAM* findUnbalanced(PROGRAM* root)
{
    for(PROGRAM* child = root->child; child != NULL; child = child->sibling)
    {
        if (! checkIfBalanced(child))
        {
            PROGRAM* unbalanced = findUnbalanced(child);
            if (unbalanced != NULL)
                return unbalanced;
            else
                return child;
        }
    }

    return NULL;
}

void day7(void)
{
    if (!parse())
    {
        printf("Failed to parse input\n");
        return;
    }
    PROGRAM* root = findRoot();
    if (root == NULL)
        return;

    printf("Part 1: %s\n", root->name);

    calculateWeight(root);
    PROGRAM* badProgram = findUnbalanced(root);
        
    printf("Part 2: %i\n", badProgram == NULL ? -1 : badProgram->expectedWeigth);    
}

