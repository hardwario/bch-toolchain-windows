# BigClown Firmware Windows Toolchain  
For Microsoft Windows 7, 8, 10.

Toolchain is based on [BusyBox](https://busybox.net/about.html) enviroment.

Installs into `%ProgramFiles(x86)%` on 64bit OS or into `%ProgramFiles%` on 32bit OS.
Defines [HKLM](https://www.google.com/search?q=hklm) environment variable `%BigClown%` pointing to top level directory of installation.

Adds `%BigClown%\\cmd` at the end of `%Path%` on HKLM level (if you like use different version of Git or other tools, just use your favourite direcotry before BigClown installation in `%Path%`). There are scripts/binaries for toolchain executables:

  * Daily use
    * `sh.cmd` - starts BusyBox shell, adds GCC binaries in `$BIGCLOWN/bin` at the beginning of `$PATH`. That allows to use other version of GNU ARM Embedded Toolchain if needed. Just copy sh.cmd, modify GCC path and use modified script to start toolchain.
    * `git.exe` - Git executable
    * `make.exe` - GNU Make executable
    * `echo.exe`, `mkdir.cmd`, `rm.exe` - Makefile dependencies served by BusyBox
    * `bcf.cmd` - script calling BigClown Firmware Flasher (implemented in Python and packed by PyInstaller)
    * `dfu-util.exe` - USB DFU flasher
  * Installation or check purposes
    * `dfu-driver-install.cmd` - installs USB DFU drivers. Has to be used before connecting STM32 MCU in DFU mode to PC (BigClown Firmware Windows Toolchain has to installed before connecting STM32 MCU in DFU mode). Uses zadic.exe
    * zadig.exe - check/fix USB HID drivers (in case STM32 MCU in DFU mode was connected to PC before installation - non-functional ST USB DFU drivers are installed by Plug & PLay system)
    
Toolchain can be started in different ways:
  * Pick **BigClown Toolchain** in Start menu
  * Start cmd and then `sh` (`sh.cmd` is used for that)
  * Right click on directory and choose **Open with BigClown Toolchain** (defined in [HKCU](https://www.google.com/search?q=HKCU))
  
## Usage examples

```
bcf create bctest
cd bctest
sh
make
```

## Components 
32bit versions, drivers 32bit & 64bit:
  * [GNU ARM Embedded Toolchain 6-2017-q2-update](https://developer.arm.com/open-source/gnu-toolchain/gnu-rm/downloads)
    * arm-none-eabi\\*
    * bin\\*
    * lib\\*
    * share\\*
  * [Git for Windows MinGit-busybox 2.14.1](https://github.com/git-for-windows/git/) includes BusyBox v1.28.0.git
    * cmd\\*
    * etc\\*
    * mingw32\\*
    * usr\\*
  * [GNU MCU Eclipse Windows Build Tools v2.9-20170629-1013](https://github.com/gnu-mcu-eclipse/windows-build-tools/)
    * `make.exe` - GNU Make
    * Makefile dependencies - `echo.exe`, `mkdir.exe`, `rm.exe`
  * [dfu-util-static v0.8](https://sourceforge.net/projects/dfu-util/files/dfu-util-0.8-binaries/win32-mingw32/)
  * [libwdi v1.2.5](https://github.com/pbatard/libwdi) WinUSB drivers for STM32 DFU
  * [Zadig v2.3](http://zadig.akeo.ie/) USB driver check&fix for STM32 DFU
  * [STM32 Virtual COM Port Driver v1.4.0](http://www.st.com/en/development-tools/stsw-stm32102.html)
  * [BigClown Firmware Flasher v0.2.1](https://github.com/bigclownlabs/bch-firmware-flasher/)
    * bcf.exe - Python script packed with [PyInstaller](http://www.pyinstaller.org/)

## Build prerequisites

  * Microsoft Windows 7, 8, 10
  * [7-Zip](http://www.7-zip.org/download.html)
  * [Python 2.7.13](https://www.python.org/downloads/release/python-2713/)
  * [Inno Setup v5.5.9](http://www.jrsoftware.org/isinfo.php)
