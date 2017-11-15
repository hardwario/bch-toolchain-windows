@ECHO off
PUSHD .
IF exist "%BigClownPlayground%\dfu" CD "%BigClownPlayground%\dfu
where /q pnputil
IF ERRORLEVEL 1 (
    ECHO Application pnputil is missing! Can not remove bloated oemXX.inf drivers.
) ELSE (
powershell -Command "pnputil /e | Select-String -Context 2 'Driver package provider :\s+ libwdi' | ForEach-Object { ($_.Context.PreContext[1] -split ' : +')[1] } | ForEach-Object {pnputil /d $_}"
)
powershell -Command "If ((Get-WindowsDriver -Online -All | where ProviderName -match 'libwdi' | where Version -match '6.1.7600.16385').Count -gt 0) {exit 1} else {exit 0}"
IF ERRORLEVEL 1 (
    ECHO Libwdi DFU driver is allready installed.
) ELSE (
    zadic.exe --vid 0x0483 --pid 0xDF11 --create stm32dfu
    RMDIR /S /Q usb_driver
)
POPD
