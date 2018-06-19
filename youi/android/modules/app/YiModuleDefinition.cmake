include(${YouiEngine_DIR}/cmake/Modules/android/YiModuleUtilities.cmake)

get_filename_component(_PROJECT_DIR ${CMAKE_CURRENT_LIST_DIR}/../../.. ABSOLUTE)

if(YI_LOCAL_JS)
    set(USE_LOCAL_JS "YI_LOCAL_JS=ON")

    if(YI_LOCAL_JS_INLINE)
        set(USE_JS_INLINE "YI_LOCAL_JS_INLINE=ON")
    endif()
endif()

yi_define_module(Auryn
    TYPE APPLICATION
    PROJECT_DIR ${_PROJECT_DIR}
    VARIABLES
        "YI_PROJECT_NAME=Auryn"
        "YI_PACKAGE_NAME=tv.youi.auryn"
        "YI_BUILD_NUMBER=1"
        "YI_VERSION_NUMBER=1.0.0"
        "YI_API_LEVEL=21"
        "YI_TARGET_SDK_API_LEVEL=27"
        ${USE_LOCAL_JS}
        ${USE_JS_INLINE}
)
