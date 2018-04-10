if exist git rmdir /S /Q git
mkdir git
cd git
powershell -Command "Invoke-WebRequest https://github.com/git-for-windows/git/releases/download/v2.17.0.windows.1/MinGit-2.17.0-busybox-32-bit.zip -OutFile MinGit-2.17.0-busybox-32-bit.zip"
"%ProgramFiles%\7-Zip\7z.exe" x MinGit-2.17.0-busybox-32-bit.zip
cd ..
if exist gcc rmdir /S /Q gcc
mkdir gcc
cd gcc
powershell -Command "Invoke-WebRequest https://armkeil.blob.core.windows.net/developer/Files/downloads/gnu-rm/7-2017q4/gcc-arm-none-eabi-7-2017-q4-major-win32.zip -OutFile gcc-arm-none-eabi-7-2017-q4-major-win32.zip"   
"%ProgramFiles%\7-Zip\7z.exe" x gcc-arm-none-eabi-7-2017-q4-major-win32.zip
cd ..
if exist make rmdir /S /Q make
mkdir make
cd make
powershell -Command "Invoke-WebRequest https://github.com/gnu-mcu-eclipse/windows-build-tools/releases/download/v2.10-20180103/gnu-mcu-eclipse-build-tools-2.10-20180103-1919-win32.zip -OutFile gnu-mcu-eclipse-build-tools-2.10-20180103-1919-win32.zip"
"%ProgramFiles%\7-Zip\7z.exe" x gnu-mcu-eclipse-build-tools-2.10-20180103-1919-win32.zip
cd ..
if exist make64 rmdir /S /Q make
mkdir make64
cd make64
powershell -Command "Invoke-WebRequest https://github.com/gnu-mcu-eclipse/windows-build-tools/releases/download/v2.10-20180103/gnu-mcu-eclipse-build-tools-2.10-20180103-1919-win64.zip -OutFile gnu-mcu-eclipse-build-tools-2.10-20180103-1919-win64.zip"
"%ProgramFiles%\7-Zip\7z.exe" x gnu-mcu-eclipse-build-tools-2.10-20180103-1919-win64.zip
cd ..
powershell -Command "Invoke-WebRequest http://www.ftdichip.com/Drivers/CDM/CDM21228_Setup.zip -OutFile CDM21228_Setup.zip"
"%ProgramFiles%\7-Zip\7z.exe" x CDM21228_Setup.zip
powershell -Command "Invoke-WebRequest https://github.com/mridgers/clink/releases/download/0.4.9/clink_0.4.9_setup.exe -OutFile clink_0.4.9_setup.exe"
