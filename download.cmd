if exist git rmdir /S /Q git
mkdir git
cd git
powershell -Command "Invoke-WebRequest https://github.com/git-for-windows/git/releases/download/v2.14.2.windows.2/MinGit-2.14.2.2-busybox-32-bit.zip -OutFile MinGit-2.14.2.2-busybox-32-bit.zip"
"%ProgramFiles%\7-Zip\7z.exe" x MinGit-2.14.2.2-busybox-32-bit.zip
cd ..
if exist gcc rmdir /S /Q gcc
mkdir gcc
cd gcc
powershell -Command "Invoke-WebRequest https://developer.arm.com/-/media/Files/downloads/gnu-rm/6-2017q2/gcc-arm-none-eabi-6-2017-q2-update-win32.zip -OutFile gcc-arm-none-eabi-6-2017-q2-update-win32.zip"
"%ProgramFiles%\7-Zip\7z.exe" x gcc-arm-none-eabi-6-2017-q2-update-win32.zip
cd ..
if exist make rmdir /S /Q make
mkdir make
cd make
powershell -Command "Invoke-WebRequest https://github.com/gnu-mcu-eclipse/windows-build-tools/releases/download/v2.9-20170629-1013/gnu-mcu-eclipse-build-tools-2.9-20170629-1013-win32.zip -OutFile gnu-mcu-eclipse-build-tools-2.9-20170629-1013-win32.zip"
"%ProgramFiles%\7-Zip\7z.exe" x gnu-mcu-eclipse-build-tools-2.9-20170629-1013-win32.zip
cd ..
powershell -Command "Invoke-WebRequest http://www.ftdichip.com/Drivers/CDM/CDM21228_Setup.zip -OutFile CDM21228_Setup.zip"
"%ProgramFiles%\7-Zip\7z.exe" x CDM21228_Setup.zip
powershell -Command "Invoke-WebRequest https://github.com/mridgers/clink/releases/download/0.4.8/clink_0.4.8_setup.exe -OutFile clink_0.4.8_setup.exe"
