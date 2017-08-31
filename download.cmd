powershell -Command "Invoke-WebRequest https://developer.arm.com/-/media/Files/downloads/gnu-rm/6-2017q2/gcc-arm-none-eabi-6-2017-q2-update-win32.zip -OutFile gcc-arm-none-eabi-6-2017-q2-update-win32.zip"
"%ProgramFiles%\7-Zip\7z.exe" x gcc-arm-none-eabi-6-2017-q2-update-win32.zip
powershell -Command "Invoke-WebRequest https://github.com/git-for-windows/git/releases/download/v2.14.1.windows.1/MinGit-2.14.1-busybox-32-bit.zip -OutFile MinGit-2.14.1-busybox-32-bit.zip"
"%ProgramFiles%\7-Zip\7z.exe" x MinGit-2.14.1-busybox-32-bit.zip
powershell -Command "Invoke-WebRequest https://github.com/gnu-mcu-eclipse/windows-build-tools/releases/download/v2.9-20170629-1013/gnu-mcu-eclipse-build-tools-2.9-20170629-1013-win32.zip -OutFile gnu-mcu-eclipse-build-tools-2.9-20170629-1013-win32.zip"
"%ProgramFiles%\7-Zip\7z.exe" x gnu-mcu-eclipse-build-tools-2.9-20170629-1013-win32.zip


