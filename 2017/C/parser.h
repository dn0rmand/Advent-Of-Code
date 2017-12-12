#if ! __PARSER__

#define __PARSER__

void skipSpaces(char** input);
char* getToken(char** input);
int getNumber(char** input);
int expect(char** input, char c);
int isEOL(char** input);

#endif
