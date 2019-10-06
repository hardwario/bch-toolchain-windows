if exist git rmdir /S /Q git
mkdir git
cd git
curl -L -O https://github.com/git-for-windows/git/releases/download/v2.23.0.windows.1/MinGit-2.23.0-busybox-32-bit.zip
7z x MinGit-2.23.0-busybox-32-bit.zip
cd ..
if exist gcc rmdir /S /Q gcc
mkdir gcc
cd gcc
curl -L -O https://developer.arm.com/-/media/Files/downloads/gnu-rm/8-2019q3/gcc-arm-none-eabi-8-2019-q3-update-win32.zip
7z x gcc-arm-none-eabi-8-2019-q3-update-win32.zip
cd ..
if exist make rmdir /S /Q make
mkdir make
cd make
curl -L -O https://github.com/gnu-mcu-eclipse/windows-build-tools/releases/download/v2.12-20190422/gnu-mcu-eclipse-windows-build-tools-2.12-20190422-1053-win32.zip
7z x gnu-mcu-eclipse-windows-build-tools-2.12-20190422-1053-win32.zip
cd ..
if exist make64 rmdir /S /Q make64
mkdir make64
cd make64
curl -L -O https://github.com/gnu-mcu-eclipse/windows-build-tools/releases/download/v2.12-20190422/gnu-mcu-eclipse-windows-build-tools-2.12-20190422-1053-win64.zip
7z x gnu-mcu-eclipse-windows-build-tools-2.12-20190422-1053-win64.zip
cd ..
curl -L -O https://github.com/mridgers/clink/releases/download/0.4.9/clink_0.4.9_setup.exe
curl -L -O https://www.ftdichip.com/Drivers/CDM/CDM21228_Setup.zip
7z x CDM21228_Setup.zip
