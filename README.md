# BigClown Firmware Windows Toolchain  
For Microsoft Windows 7,8,10.

Components (32bit versions, drivers 32bit & 64bit):
  * [GNU ARM Embedded Toolchain 6-2017-q2-update](https://developer.arm.com/open-source/gnu-toolchain/gnu-rm/downloads)
    * arm-none-eabi\..
    * bin\..
    * lib\..
    * share\..
  * [Git for Windows MinGit-busybox 2.14.1](https://github.com/git-for-windows/git/) includes BusyBox v1.28.0.git
    * cmd\..
    * etc\..
    * mingw32\..
    * usr\..
  * [GNU MCU Eclipse Windows Build Tools v2.9-20170629-1013](https://github.com/gnu-mcu-eclipse/windows-build-tools/)
    * make.exe - GNU Make
  * [dfu-util-static v0.8](https://sourceforge.net/projects/dfu-util/files/dfu-util-0.8-binaries/win32-mingw32/)
  * [libwdi v1.2.5](https://github.com/pbatard/libwdi) WinUSB drivers for STM32 DFU
  * [Zadig v2.3](http://zadig.akeo.ie/) USB driver check&fix for STM32 DFU
  * [STM32 Virtual COM Port Driver v1.4.0](http://www.st.com/en/development-tools/stsw-stm32102.html)
  * [BigClown Firmware Flasher v0.1.9](https://github.com/bigclownlabs/bch-firmware-flasher/)
    * bcf.exe - Python script packed with [PyInstaller](http://www.pyinstaller.org/)

Build prerequisites:
  * Microsoft Windows 7,8,10
  * [7-Zip](http://www.7-zip.org/download.html)
  * [Python 2.7.13](https://www.python.org/downloads/release/python-2713/)
  * [Inno Setup v5.5.9](http://www.jrsoftware.org/isinfo.php)
