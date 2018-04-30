// © You i Labs Inc. 2000-2017. All rights reserved.
#include "App.h"
#include <glog/logging.h>

App::App() = default;

App::~App() = default;

bool App::UserInit()
{
#if !defined(YI_MINI_GLOG)
    // miniglog defines this using a non-const char * causing a compile error and it has no implementation anyway.
    google::InitGoogleLogging("--logtostderr=1");
#endif

    return PlatformApp::UserInit();
}

bool App::UserStart()
{
    return PlatformApp::UserStart();
}

void App::UserUpdate()
{
    PlatformApp::UserUpdate();
}
