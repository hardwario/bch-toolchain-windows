@echo off
if exist "%1" (
    cd "%1"
)
if not defined BCT (
    if exist "%BigClown%" (
        title BigClown Toolbox v1.0.0
        set "BCT=%BigClown%\bct"
        set "Path=%BCT%;%BigClown%\git\cmd;%BigClown%\gcc\bin;%BigClown%\dfu;%Path%"
        echo Added BigClown Toolchain into Path
    )
) else (
    echo BigClown Toolchain paths allready added
)
