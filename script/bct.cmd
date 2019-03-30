@echo off
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Do not run under administrative permissions!
    echo Use ordinary user account authorization instead please.
    pause
    exit /b 1
)
if exist "%1" cd "%1"
if not defined BCT (
    if exist "%BigClownToolchain%" (
        title BigClown Toolchain v%BigClownToolchainVersion%
        set "BCT=%BigClownToolchain%"
        set "Path=%BigClownToolchain%\script;%BigClownToolchain%\git\cmd;%BigClownToolchain%\git\usr\bin;%BigClownToolchain%\gcc\bin;%BigClownToolchain%\make;%BigClownToolchain%\dfu;%Path%"
        echo Welcome to BigClown Toolchain - git, ssh, make, dfu-util, arm-none-eabi-gcc, bcf, bch, bcg, bcsb
        echo Documentation https://doc.bigclown.com/
    ) else (
        echo BigClownToolchain environment variable not defined, reinstall Toolchain please.
        pause
        exit
    )
) else echo "BigClown Toolchain paths allready added" 
