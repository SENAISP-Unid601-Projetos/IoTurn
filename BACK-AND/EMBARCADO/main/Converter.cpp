#include "converter.h"
#include <cstdio> 

static char floatBuffer[32];
static char intBuffer[16];

const char* floatToStr(float valor, int casasDecimais) {
    char formato[10];
    snprintf(formato, sizeof(formato), "%%.%df", casasDecimais);
    snprintf(floatBuffer, sizeof(floatBuffer), formato, valor);
    return floatBuffer;
}

const char* intToStr(int valor) {
    snprintf(intBuffer, sizeof(intBuffer), "%d", valor);
    return intBuffer;
}
