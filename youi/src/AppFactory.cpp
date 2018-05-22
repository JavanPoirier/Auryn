// © You i Labs Inc. 2000-2017. All rights reserved.
#include "AppFactory.h"
#include "App.h"

#define APP_NAME "Video Player"

#define APP_DENSITY (72)
#define APP_WIDTH (1920)
#define APP_HEIGHT (1080)

CYIApp *AppFactory::Create()
{
    return new App();
}

int AppFactory::GetWindowWidth()
{
    return APP_WIDTH;
}

int AppFactory::GetWindowHeight()
{
    return APP_HEIGHT;
}

int AppFactory::GetScreenDensity()
{
    return APP_DENSITY;
}

const char *AppFactory::GetWindowName()
{
    return APP_NAME;
}
