@echo off
if exist "%1" (
    cd "%1"
)
if not defined BCT (
    if exist "%BigClown%" (
        set "BCT=%BigClown%\bct"
        set "Path=%BCT%;%BigClown%\git\cmd;%BigClown%\gnu\bin;%BigClown%\dfu;%Path%"
        echo Added BigClown Toolchain into Path
    )
) else (
    echo BigClown Toolchain paths allready added
)