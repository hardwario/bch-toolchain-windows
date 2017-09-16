"%BigClown%\dfu\zadic.exe" --vid 0x0483 --pid 0xDF11 --create stm32dfu
del /S /Q /F "%BigClown%\dfu\usb_driver"
rmdir /S /Q "%BigClown%\dfu\usb_driver"
