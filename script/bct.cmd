@echo off
if exist "%1" (
    cd "%1"
)
if not defined BCT (
    if exist "%BigClownToolchain%" (
        title BigClown Toolchain v%BigClownToolchainVersion%
        set "BCT=%BigClownToolchain%"
        set "Path=%BigClownToolchain%\script;%BigClownToolchain%\git\cmd;%BigClownToolchain%\git\usr\bin;%BigClownToolchain%\gcc\bin;%BigClownToolchain%\make;%BigClownToolchain%\dfu;%Path%"
        chcp 65001        
        echo Welcome to BigClown Toolchain - bcf, git, ssh, make, dfu-util, arm-none-eabi-gcc
        echo Documentation https://doc.bigclown.com/
    )
) else (
    echo BigClown Toolchain paths allready added
)
