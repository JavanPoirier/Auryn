// © You i Labs Inc. 2000-2017. All rights reserved.
#include "App.h"
#include <glog/logging.h>

App::App() = default;

App::~App() = default;

bool App::UserInit()
{
    google::InitGoogleLogging("--logtostderr=1");

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
