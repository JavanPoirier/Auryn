# =============================================================================
# © You i Labs Inc. 2000-2017. All rights reserved.
cmake_minimum_required(VERSION 3.5 FATAL_ERROR)

# Pre-defined options
option(YI_TREAT_WARNINGS_AS_ERRORS "Warnings will result in failure to compile when set to ON." ON)
option(YI_CLEAN_ASSETS_FIRST "Indicate whether assets in the build directories should be cleaned before copying the source assets." OFF)
option(YI_LOCAL_JS "If true, the JS files for this project will be bundled and included locally in the app assets, rather than needing to be fetched from a yarn server." OFF)
option(YI_LOCAL_JS_INLINE "If bundling JS locally, the JS files for this project will be bundled and compiled inline with the source code." OFF)
option(YI_LOCAL_JS_DEV "If bundling JS locally, the 'react-native bundle' call will have the 'dev' flag set to the value of this option." OFF)
option(YI_LOCAL_JS_MINIFY "If bundling JS locally, the 'react-native bundle' call will have the 'minify' flag set to the value of this option." ON)

# The name of the project. When building for Android, this is passed from Android Studio.
if(NOT YI_PROJECT_NAME)
    set(YI_PROJECT_NAME "Auryn")
endif()

# The package name used for the project.
if(NOT YI_PACKAGE_NAME)
    set(YI_PACKAGE_NAME "tv.youi.auryn")
endif()

# The name of the application displayed on the device.
if(NOT YI_DISPLAY_NAME)
    set(YI_DISPLAY_NAME "Auryn")
endif()

set(YI_VERSION_NUMBER "1.0.0.0" CACHE STRING "Build version of the application. This is the version that will be displayed to the end user in the store.")
set(YI_BUILD_NUMBER "${YI_VERSION_NUMBER}" CACHE STRING "Release version number that needs to be incremented for each store submission. For Apple platforms, this is the CFBundleVersion. For Android, this is the Version Code.")
set(YI_YOUI_ENGINE_VERSION 5.0.0 CACHE STRING "Version required for the You.i Engine.")
set(YI_YOUI_ENGINE_HOME "../" CACHE STRING "Youi Engine home search path")
set(YI_EXCLUDED_ASSET_FILE_EXTENSIONS ".log,.aep" CACHE STRING "Comma-delimited list of file extensions whose files should be omitted during asset copying.")

set(YI_REACT_NATIVE_VERSION 0.0.1 CACHE STRING "Version required for the You.i React Native library.")

message(STATUS "----------------------------------------")
message(STATUS "PROJECT SETTINGS")
message(STATUS "----------------------------------------")
message(STATUS "YI_TREAT_WARNINGS_AS_ERRORS = ${YI_TREAT_WARNINGS_AS_ERRORS}")
message(STATUS "YI_CLEAN_ASSETS_FIRST = ${YI_CLEAN_ASSETS_FIRST}")
message(STATUS "YI_LOCAL_JS = ${YI_LOCAL_JS}")
message(STATUS "YI_LOCAL_JS_INLINE = ${YI_LOCAL_JS_INLINE}")
message(STATUS "YI_LOCAL_JS_MINIFY = ${YI_LOCAL_JS_MINIFY}")
message(STATUS "YI_LOCAL_JS_DEV = ${YI_LOCAL_JS_DEV}")
message(STATUS "YI_PROJECT_NAME = ${YI_PROJECT_NAME}")
message(STATUS "YI_PACKAGE_NAME = ${YI_PACKAGE_NAME}")
message(STATUS "YI_DISPLAY_NAME = ${YI_DISPLAY_NAME}")
message(STATUS "YI_VERSION_NUMBER = ${YI_VERSION_NUMBER}")
message(STATUS "YI_YOUI_ENGINE_VERSION = ${YI_YOUI_ENGINE_VERSION}")
message(STATUS "YI_YOUI_ENGINE_HOME = ${YI_YOUI_ENGINE_HOME}")
message(STATUS "YI_REACT_NATIVE_VERSION = ${YI_REACT_NATIVE_VERSION}")
message(STATUS "----------------------------------------")

set(_STAGING_DIR "${CMAKE_CURRENT_BINARY_DIR}/Staging")
set(_SRC_DIR "${CMAKE_CURRENT_SOURCE_DIR}/src")

find_path(YouiEngine_DIR
    YouiEngineConfigVersion.cmake
    PATHS
        ${CMAKE_CURRENT_SOURCE_DIR}/../..    # Used only by samples that are generated from within the packaged engine directory
        ${CMAKE_CURRENT_SOURCE_DIR}/../../.. # Used only by samples that are generated from within the packaged engine directory
        ${YI_YOUI_ENGINE_HOME}
        ENV YOUIENGINE_HOME
)

mark_as_advanced(YouiEngine_DIR)

if (NOT YouiEngine_DIR)
    message(FATAL_ERROR "Could not locate the You.i Engine directory. Please check your YOUIENGINE_HOME environment variable.")
endif()

# The ordering of the paths within the CMAKE_MODULE_PATH variable is imporant, since having the project's 'cmake'
# path first will tell CMake to first look under that folder when the short form 'include(Modules/<module>)' command is used
# instead of the long form 'include(<path>/Modules/<filename>.cmake)'.
#
# If CMake finds a module under the project directory structure, it will load that file and stop looking in the CMAKE_MODULE_PATH.
# This allows projects to customize modules as they need to, without requiring changes at the engine level.
list(APPEND CMAKE_MODULE_PATH ${CMAKE_CURRENT_SOURCE_DIR}/cmake ${YouiEngine_DIR}/cmake)

# The call to project() needs to happen after the Platform file has been included. This is because some
# platforms set CMake specific variables that affect the choices made when a language is configured.
#
# If you would like to have the project() call happen at the start of the CMakeLists.txt file, then
# you will need to make sure that no languages are set when the project() command is called. You can do
# this by passing NONE to the LANGUAGES property. If you do so, however, you will need to add calls to
# enable_language() for each language that your project supports.
#
# For example:
#
# cmake_minimum_required(VERSION 3.7 FATAL_ERROR)
# project(MyProject LANGUAGES NONE)
#
# ...
# include(Platform/Yi${_PLATFORM_CAPITALIZED})
# ...
# enable_language(CXX)
# enable_language(C)
project(${YI_PROJECT_NAME} LANGUAGES C CXX)

if (NOT MSVC_IDE AND NOT XCODE AND NOT CMAKE_BUILD_TYPE)
    message(FATAL_ERROR "CMAKE_BUILD_TYPE needs to be set for single configuration generators. Default builds are not allowed.")
endif()

if(NOT DEFINED YI_PLATFORM)
    message(FATAL_ERROR "YI_PLATFORM must be known. Please specify a toolchain file.")
endif()

include(Modules/YiCapitalizeString)
yi_capitalize_string(SRC_STRING "${YI_PLATFORM}"
    RESULT_VARIABLE _PLATFORM_CAPITALIZED
    DELIMITERS "-;_"
)

string(TOUPPER "${YI_PLATFORM}" _PLATFORM_UPPER)
string(TOLOWER "${YI_PLATFORM}" _PLATFORM_LOWER)
include(Platform/Yi${_PLATFORM_CAPITALIZED} OPTIONAL RESULT_VARIABLE HAVE_YIPLATFORM_INCLUDE)
if (NOT HAVE_YIPLATFORM_INCLUDE)
    message( FATAL_ERROR "Unsupported platform specified: " ${_PLATFORM_CAPITALIZED})
endif()

# By having the list of source files for the project outside of the CMakeLists.txt file a project can
# use tools to auto-generate the contents of that file without having a lot of commits on the CMakeLists.txt
# file. This also makes the CMakeLists.txt and SourceList.cmake files more portable to move between projects with
# minimal effort.
include("${CMAKE_CURRENT_SOURCE_DIR}/SourceList.cmake")

# Locating the You.i Engine is now done via the 'find_package' command. We first set the version of the engine that
# we want to look for, using the PACKAGE_FIND_VERSION variable that is used within the 'find_package' flow.
#
# Next, the call to 'find_package' passing the 'YouiEngine_DIR' path to the HINTS argument is made. This tells
# CMake to look within the 'YouiEngine_DIR' path for the You.i Engine. If found, the 'find_package' command will
# give back a 'youiengine' target that the project can link against. This target contains all of the third party
# libraries and their include directories, as well as the engine library, its include directories and any compiler
# definitions or options.

if(ANDROID AND IS_DIRECTORY ${YouiEngine_DIR}/core)
    add_subdirectory(${YouiEngine_DIR}/core ${CMAKE_CURRENT_BINARY_DIR}/core)
    add_subdirectory(${YouiEngine_DIR}/react/react-native-youiengine ${CMAKE_CURRENT_BINARY_DIR}/react-native-youiengine)
else()
    if(NOT YouiEngine_FOUND)
        find_package(YouiEngine
            ${YI_YOUI_ENGINE_VERSION}
            COMPONENTS
                react
            HINTS
                ${YouiEngine_DIR}
            REQUIRED
        )
    endif()
endif()

include(Modules/YiPlatformSourceFiles)
set(YI_PROJECT_CODE_FILES
    ${YI_APP_SOURCE_FILES}
    ${YI_APP_SOURCE_HEADERS}
    ${PLATFORM_SOURCE_FILES_${_PLATFORM_UPPER}}
    ${PLATFORM_SOURCE_FILES_${_PLATFORM_UPPER}_${YI_RENDER_TYPE}}
    ${PLATFORM_SOURCE_HEADERS_${_PLATFORM_UPPER}}
    ${PLATFORM_SOURCE_HEADERS_${_PLATFORM_UPPER}_${YI_RENDER_TYPE}}
    ${YI_PROJECT_SOURCE}
    ${YI_PROJECT_HEADERS}
)

# Not all platforms will need to perform some kind of initialization. Because this is optional,
# we first check to see if the command actually exists. If not, we can safely ignore it.
#
# Initialization is performed before the target for the project() is created. At this time,
# PROJECT_NAME is not available and thus no use of it should be done. If further
# configuration is required, that can be done within the optional yi_configure_platform method.
include(Modules/${_PLATFORM_LOWER}/YiInitializePlatform OPTIONAL)
if(COMMAND yi_initialize_platform)
    yi_initialize_platform()
endif()

# Some platforms, such as IOS and TVOS have resources that are used for setting up the application
# icons. By making this include OPTIONAL, if no YiPlatformResources.cmake file exists, the build
# will continue without failing.
include(Modules/${_PLATFORM_LOWER}/YiPlatformResources OPTIONAL)

# The yi_add_executable function can be swapped with yi_add_library, if your project needs to
# output a library instead of an application executable.
include(Modules/YiAddExecutable)
yi_add_executable(TARGET ${PROJECT_NAME}
    SRC_FILES ${YI_PROJECT_CODE_FILES}
    EXTRA_FILES ${YI_PLATFORM_RESOURCES_${_PLATFORM_UPPER}}
)

# NOTE: This is only valid for Visual Studio-based generators
set_directory_properties(PROPERTIES
    VS_STARTUP_PROJECT ${PROJECT_NAME}
)

target_include_directories(${PROJECT_NAME}
    PRIVATE ${_SRC_DIR}
    PRIVATE ${YouiEngine_DIR}/templates/mains/src
)

target_link_libraries(${PROJECT_NAME}
    PRIVATE
        youi::react
        youi::engine
)

set_target_properties(${PROJECT_NAME} PROPERTIES
    RESOURCE "${YI_PLATFORM_RESOURCES_${_PLATFORM_UPPER}}"
)

source_group("Header Files" FILES ${YI_PROJECT_HEADERS})
source_group("Source Files" FILES ${YI_PROJECT_SOURCE})
source_group("Header Files\\App" FILES
    ${YI_APP_SOURCE_HEADERS}
    ${PLATFORM_SOURCE_HEADERS_${_PLATFORM_UPPER}}
    ${PLATFORM_SOURCE_HEADERS_${_PLATFORM_UPPER}_${YI_RENDER_TYPE}}
)
source_group("Source Files\\App" FILES
    ${YI_APP_SOURCE_FILES}
    ${PLATFORM_SOURCE_FILES_${_PLATFORM_UPPER}}
    ${PLATFORM_SOURCE_FILES_${_PLATFORM_UPPER}_${YI_RENDER_TYPE}}
)
source_group("Resources" FILES ${YI_PLATFORM_RESOURCES_${_PLATFORM_UPPER}})

# === START OF OPTION HANDLING ================================================

# Instrumented builds can help with determining code coverage.
# By using this module, the project can set up Debug builds to be able to output
# coverage data.
include(Modules/YiConfigureInstrumentedBuild)
yi_configure_instrumented_build(TARGET ${PROJECT_NAME})

# === END OF OPTION HANDLING ==================================================

# === START OF COMPILER SETUP =================================================

include(Modules/YiConfigureWarningsAsErrors)
yi_configure_warnings_as_errors(TARGET ${PROJECT_NAME})

if (NOT MSVC)
    # With Wall enabled on MSVC we get warnings in system includes that we don't want.
    # We will use the default warning level instead of MSVC.
    check_cxx_compiler_flag("-Wall" SUPPORTS_WALL_FLAG)
    check_cxx_compiler_flag("-Wextra" SUPPORTS_WEXTRA_FLAG)
    check_cxx_compiler_flag("-Wno-float-equal" SUPPORTS_WNO_FLOAT_EQUAL_FLAG)
    check_cxx_compiler_flag("-Wpointer-arith" SUPPORTS_WPOINTER_ARITH_FLAG)
    check_cxx_compiler_flag("-Wwrite-strings" SUPPORTS_WWRITE_STRINGS_FLAG)
    check_cxx_compiler_flag("-Wunused-variable" SUPPORTS_WUNUSED_VARIABLE_FLAG)
    check_cxx_compiler_flag("-Wno-unused-parameter" SUPPORTS_WNO_UNUSED_PARAMETER_FLAG)
    check_cxx_compiler_flag("-Wno-unused-result" SUPPORTS_WNO_UNUSED_RESULT_FLAG)
    check_cxx_compiler_flag("-Wno-unused-function" SUPPORTS_WNO_UNUSED_FUNCTION_FLAG)
    target_compile_options(${YI_PROJECT_NAME}
        PRIVATE
            $<$<BOOL:${SUPPORTS_WALL_FLAG}>:-Wall>
            $<$<BOOL:${SUPPORTS_WEXTRA_FLAG}>:-Wextra>
            $<$<BOOL:${SUPPORTS_WNO_FLOAT_EQUAL_FLAG}>:-Wno-float-equal>
            $<$<BOOL:${SUPPORTS_WPOINTER_ARITH_FLAG}>:-Wpointer-arith>
            $<$<BOOL:${SUPPORTS_WWRITE_STRINGS_FLAG}>:-Wwrite-strings>
            $<$<BOOL:${SUPPORTS_WUNUSED_VARIABLE_FLAG}>:-Wunused-variable>
            $<$<BOOL:${SUPPORTS_WNO_UNUSED_PARAMETER_FLAG}>:-Wno-unused-parameter> # for JSExecutor header
            $<$<BOOL:${SUPPORTS_WNO_UNUSED_RESULT_FLAG}>:-Wno-unused-result>
            $<$<BOOL:${SUPPORTS_WNO_UNUSED_FUNCTION_FLAG}>:-Wno-unused-function>
    )
endif()

# The configuration method is made available for a platform to set up any specific
# functionality that requires use of the target variables, such as PROJECT_NAME, etc.
if(COMMAND yi_configure_platform)
    yi_configure_platform(PROJECT_TARGET ${PROJECT_NAME})
endif()

set_target_properties(${PROJECT_NAME} PROPERTIES CXX_STANDARD 14)

# === END OF COMPILER SETUP ===================================================

# === START OF ASSET COPYING ==================================================
include(Modules/YiConfigureAssetCopying)
yi_configure_asset_copying(PROJECT_TARGET ${PROJECT_NAME}
    OUTPUT_DIRECTORY ${YI_BASE_OUTPUT_DIRECTORY}
    EXCLUDED_EXTENSIONS ${YI_EXCLUDED_ASSET_FILE_EXTENSIONS}
)

if (YI_LOCAL_JS)
    target_compile_definitions(${PROJECT_NAME}
        PRIVATE YI_LOCAL_JS_APP
    )
endif()

if (YI_LOCAL_JS_INLINE)
    target_compile_definitions(${PROJECT_NAME}
        PRIVATE YI_INLINE_JS_APP
    )
endif()

include(Modules/react/YiConfigureJsBundling)
find_program (YARN_EXECUTABLE yarn)
if (YARN_EXECUTABLE)

    # The yarn command causes batch scripts to terminate early. Prefixing with 'call' prevents this.
    if(CMAKE_GENERATOR MATCHES "Visual Studio" OR CMAKE_GENERATOR MATCHES "NMake")
        set(_YARN_COMMAND_PREFIX "call")
    endif()
    get_filename_component(_NODE_DIR "${CMAKE_CURRENT_SOURCE_DIR}/.." ABSOLUTE)
    get_filename_component(_REACT_NATIVE_YOUI_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../../react-native-youi" ABSOLUTE)

    add_custom_target(${PROJECT_NAME}_Yarn)

    if (YI_LOCAL_JS_INLINE)
        set(js_bundle_output_dir ${_SRC_DIR}/InlineJSBundleGenerated)
    else()
        set(js_bundle_output_dir ${YI_BASE_OUTPUT_DIRECTORY}/assets/jsbundles)
    endif()

    yi_configure_js_bundling(PROJECT_TARGET ${PROJECT_NAME}
        YARN_TARGET ${PROJECT_NAME}_Yarn
        WORKING_DIR ${CMAKE_CURRENT_SOURCE_DIR}/..
        INPUT_FILES index.youi.js
        OUTPUT_DIR ${js_bundle_output_dir}
        PLATFORM ${YI_PLATFORM}
        IS_DEV ${YI_LOCAL_JS_DEV}
        MINIFY ${YI_LOCAL_JS_MINIFY}
        INLINE ${YI_LOCAL_JS_INLINE}
        ASSETS_DEST ${YI_BASE_OUTPUT_DIRECTORY}
    )

    add_dependencies(${PROJECT_NAME} ${PROJECT_NAME}_Yarn)

    unset(_NODE_DIR)
    unset(_REACT_NATIVE_YOUI_DIR)
    unset(_YARN_COMMAND_PREFIX)

endif()

# === END OF ASSET COPYING ====================================================

# === START OF PROJECT PACKAGING ==============================================

# Because not every platform requires custom packaging functionality, having a Package target
# is optional only if the platform's CMake file implements the yi_configure_packaging_for_platform
# function.
include(Modules/${_PLATFORM_LOWER}/YiConfigurePackagingForPlatform OPTIONAL)

if (COMMAND yi_configure_packaging_for_platform)
    add_custom_target(${PROJECT_NAME}_Package ${YI_PACKAGE_IN_ALL})
    yi_configure_packaging_for_platform(PROJECT_TARGET ${PROJECT_NAME}
        PACKAGE_TARGET ${PROJECT_NAME}_Package
    )
endif()

# === END OF PROJECT PACKAGING ================================================
