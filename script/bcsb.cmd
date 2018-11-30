rem @echo off
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Do not run under administrative permissions!
    echo Use ordinary user account authorization instead please.
    pause
    exit /b 1
)
if exist "%BigClownToolchain%" (
cd "%BigClownToolchain%\script"
start ..\conemu\conemu.exe -title "BigClown Toolchain v%BigClownToolchainVersion% Sandbox" -runlist ^
 -new_console:bct:"MQTT broker" ..\tools\hbmqtt ^
 ^|^|^| -cur_console:s1T90V:bch1000t:"bch sub #" "..\tools\bch sub #" ^
 ^|^|^| -cur_console:s2T33V:h100t:bcg cmd /k bcg ^
 ^|^|^| -cur_console:s3T66V:h100t:cmd cmd /k """bct "%USERPROFILE%" """
 
start ..\mqtt-wall\index.html
ping 127.0.0.1 -n 3 > nul
bch pub sandbox start

) else (
    echo BigClownToolchain environment variable not defined, reinstall Toolchain please.
    pause
    exit
)
