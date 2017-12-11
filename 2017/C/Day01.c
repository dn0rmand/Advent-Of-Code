#include <stdio.h>
#include <string.h>

void day1(void)
{
	int	  part = 1;
	FILE* file = fopen("Data/Day01.data", "r");
	
	if (file == NULL)
	{
		fprintf(stderr, "File not found!");
		return;
	}
	
	char buffer[1024];
	
	printf("---- PART 1 ----\n");
	
	while (! feof(file))
	{
		char* ptr = fgets(buffer, 1024, file);
		
		if (*ptr == '*')
		{
			part = 2;
			printf("---- PART 2 ----\n");
			continue;
		}
		
		int count = (int) strlen(ptr);
		int offset = part == 2 ? (count / 2) : 1;
		if (part == 2)
			offset = count/2;
		
		int total = 0;
		for (int i = 0; i < count; i++)
		{
			char c1 = ptr[i];
			char c2 = ptr[(i+offset) % count];
			if (c1 == c2)
				total += (c1 - '0');
		}

		printf("Total = %i\n", total);
	}
	fclose(file);
}

