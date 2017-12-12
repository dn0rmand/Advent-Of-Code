#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include "parser.h"

static long checksum1 = 0;
static long checksum2 = 0;
static int dataSet    = 1;

static void logResult(void)
{
	if (dataSet == 1)
		printf("Test data for part 1 => Checksum is %li ( 18 )\n", checksum1);
	else if (dataSet == 2)
		printf("Test data for part 2 => Checksum is %li ( 9 )\n", checksum2);
	else
		printf("Real data => checksums are %li and %li ( 32020 and 236 )\n", checksum1, checksum2);
	
	checksum1 = 0;
	checksum2 = 0;
	dataSet++;
}

static int calculateChecksum2(int* data, int count)
{
	for(int i = 0; i < count; i++)
	{
		int value1 = data[i];
		if (value1 == 0)
			continue;
		for(int j = i+1; j < count; j++)
		{
			int value2 = data[j];
			if (value2 == 0)
				continue;
			
			if (value2 > value1)
			{
				if ((value2 % value1) == 0)
					return value2 / value1;
			}
			else
			{
				if ((value1 % value2) == 0)
					return value1 / value2;
			}
		}
	}
	
	printf("Didn't find two evenly divisible values\n");
	return 0;
}

static int calculateChecksum1(int* data, int count)
{
	int max = 0;
	int min = INT32_MAX;
	
	for(int i = 0; i < count; i++)
	{
		int value = data[i];
		
		if (value > max)
			max = value;
		if (value < min)
			min = value;
	}
	
	return (max - min);
}

static void processLine(char** line)
{
	int data[1024];
	int index = 0;
	while (! isEOL(line))
	{
		int value = getNumber(line);
		data[index++] = value;
		if (index >= 1024)
		{
			printf("too many values ...\n");
			return;
		}
	}
	if (dataSet != 2)
		checksum1 += calculateChecksum1(data, index);
	if (dataSet != 1)
		checksum2 += calculateChecksum2(data, index);
}

void day2(void)
{
	dataSet = 1;
	FILE* file = fopen("Data/Day02.data", "r");
	
	if (file == NULL)
	{
		fprintf(stderr, "File not found!\n");
		return;
	}
	
	char buffer[1024];
	
	while (! feof(file))
	{
		char* ptr = fgets(buffer, 1024, file);
		
		if (*ptr == '*')
		{
			logResult();
			continue;
		}
		
		processLine(&ptr);
	}
	fclose(file);
	logResult();
}

