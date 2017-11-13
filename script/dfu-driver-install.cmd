@ECHO off
PUSHD
IF exist "%BigClownToolchain%\dfu" CD "%BigClownToolchain%\dfu
where /q pnputil
IF ERRORLEVEL 1 (
    ECHO Application pnputil is missing! Can not remove bloated oemXX.inf drivers.
) ELSE (
    powershell -Command "pnputil /e | Select-String -Context 2 'Driver package provider :\s+ libwdi' | ForEach-Object { ($_.Context.PreContext[1] -split ' : +')[1] } | ForEach-Object {pnputil /d $_}"
)
zadic.exe --vid 0x0483 --pid 0xDF11 --create stm32dfu
RMDIR /S /Q usb_driver
POPD
