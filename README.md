<a href="https://www.bigclown.com/"><img src="https://bigclown.sirv.com/logo.png" width="200" alt="BigClown Logo" align="right"></a>

# BigClown Firmware Windows Toolchain  
For Microsoft Windows 7, 8, 10 (32bit and 64bit).

Toolchain is based on [BusyBox](https://busybox.net/about.html) environment, Git, GNU C, GNU Make.

Scripts/binaries for toolchain executables:

  * **Daily use** - for documentation have a look at [BigClown Documentation](https://doc.bigclown.com/)
    * BigClown Toolchain scripts
      * `script\bct.cmd` - Entry into BigClown Toolchain - adds Git, GCC, DFU paths at the beginning of `%Path%`. You can pass directory as first parametr to change to working directory.
      * `script\bcf.cmd` - Executes BigClown Firmware Tool (implemented in Python and packed by PyInstaller)
      * `script\bb.cmd` - Executes BusyBox shell (for users who likes Linux shell environment)
    * BigClown Sandbox in ConEmu `script\bcsb.cmd`
      * MQTT broker
      * MQTT cli client `bch`
      * BigClown Gateway `bcg`
      * MQTT Wall web application
    * Git
      * `git\cmd\git.exe` - Git executable
    * GNU Make
      * `make\make.exe` - GNU Make executable
    * USB DFU
      * `dfu\dfu-util.exe` - USB DFU flasher

  * Installation or check purposes
    * `dfu\dfu-driver-install.cmd` - installs USB DFU drivers. Has to be used before connecting STM32 MCU in DFU mode to PC (BigClown Firmware Windows Toolchain has to be installed before connecting STM32 MCU in DFU mode). Uses zadic.exe
    * `dfu\zadig.exe` - check/fix USB HID drivers (in case STM32 MCU in DFU mode was connected to PC before installation - non-functional ST USB DFU drivers are installed by Plug & PLay system)
    
Toolchain can be started in different ways:
  * Pick **BigClown Toolchain** in Start menu or double-click icon in Desktop
  * Start cmd and then `bct` (`script\bct.cmd` is used for that)
  * Right click on directory and choose **Open with BigClown Toolchain** (defined in [HKLM](https://www.google.com/search?q=HKCU))

Sandbox can be started: in different ways:
  * Pick **BigClown Sandbox** in Start menu or double-click icon in Desktop
  * Start cmd and then `bcsb` (`script\bcsb.cmd` is used for that)

Serial port for Gateway in Sandbox can be customized by setting environment variable PORT. If PORT environment variable it is not set, Sandbox uses last COM port reported by `bcg devices`.

## Installation directory

Default install destination directory is `%ProgramFiles(x86)%` on 64bit OS or into `%ProgramFiles%` on 32bit OS (can be changed by user during installation).
Defines [HKLM](https://www.google.com/search?q=hklm) environment variable `%BigClownToolchain%` pointing to top level directory of installation.

During first installation adds `%BigClownToolchain%\script` at the end of `%Path%` (can be deselected during installation) on HKLM level by default. That allows to use tools (`bcf`, `bch`, `bcg`, etc) from anywhere and start Toolchain by `bct`.

If you like to use different version of Git, GNU C or other tools, just use your favourite direcotry before BigClown installation in `%Path%` (e.g. change paths in `bct.cmd` or just copy `bct.cmd`, modify paths and use that modified script to define another paths). 

## Usage example

Start `cmd`.
```
bct
bcf create bctest
cd bctest
make
make dfu
```

## Components 
32bit versions, drivers 32bit & 64bit:
  * [BigClown Firmware Tool v0.23.2](https://github.com/bigclownlabs/bch-firmware-flasher/)
    * `tools\bcf.exe` - Python script packed with [PyInstaller](http://www.pyinstaller.org/)
  * [BigClown Gateway v1.15.0](https://github.com/bigclownlabs/bch-gateway)
    *  `tools\bcg.exe` - Python script packed with [PyInstaller](http://www.pyinstaller.org/)
  * [BigClown Control Tool v0.1.1](https://github.com/bigclownlabs/bch-control-tool)
    *  `tools\bch.exe` - Python script packed with [PyInstaller](http://www.pyinstaller.org/)
  * [MQTT broker hbmqtt v0.9.5](https://github.com/beerfactory/hbmqtt)
    * `tools\hbmqtt.exe` - Python script packed with [PyInstaller](http://www.pyinstaller.org/)
  * [MQTT Wall v0.4](https://github.com/bastlirna/mqtt-wall) Simple web page showing subscribed topics from MQTT server.
    * `mqtt-wall\*` - web application
  * [Git for Windows MinGit-busybox 2.19.1](https://github.com/git-for-windows/git/)
    * `git\cmd`
    * `git\etc`
    * `git\mingw32`
    * `git\usr`
  * [GNU ARM Embedded Toolchain 7-2018-q2-update](https://developer.arm.com/open-source/gnu-toolchain/gnu-rm/downloads)
    * `gcc\arm-none-eabi`
    * `gcc\bin`
    * `gcc\lib`
    * `gcc\share`
  * [GNU MCU Eclipse Windows Build Tools v2.11-20180428, GNU make version 4.2.1](https://github.com/gnu-mcu-eclipse/windows-build-tools/)
    * `make\make.exe` - GNU Make, Makefile dependencies by BusyBox:
      * `make\sh.exe`
      * `make\echo.exe`
      * `make\mkdir.exe`
      * `make\cp.exe`
      * `make\rm.exe`   
  * [Clink v0.4.9](https://github.com/mridgers/clink/)
  * [ConEmu 180626](https://conemu.github.io/)
  * [FTDI Virtual COM Port Drivers 2.12.28](http://www.ftdichip.com/Drivers/VCP.htm)
  * [dfu-util-static v0.8](https://sourceforge.net/projects/dfu-util/files/dfu-util-0.8-binaries/win32-mingw32/)
  * [libwdi v1.2.5](https://github.com/pbatard/libwdi) WinUSB drivers for STM32 DFU
  * [Zadig v2.4](http://zadig.akeo.ie/) USB driver check&fix for STM32 DFU
  * [STM32 Virtual COM Port Driver v1.4.0](http://www.st.com/en/development-tools/stsw-stm32102.html)

## Build prerequisites

  * Microsoft Windows 10 version 1803 (`cmd` shell)
  * Scoop package manager https://github.com/lukesampson/scoop/wiki/Quick-Start
  * Scoop buckets
    * `scoop bucket add extras`
    * `scoop bucket add nonportable`
    * `scoop bucket add versions`
  * Required Scoop packages `scoop install`
    * `7zip` [7-Zip](http://www.7-zip.org/)
    * `git` [Git for Windows](https://github.com/git-for-windows/git/)
    * `python36 --arch 32bit` [Python](https://www.python.org/) 3.6.7 32bit
    * `innosetup-np` [Inno Setup v5.6.1](http://www.jrsoftware.org/isinfo.php)
  * [Windows 10 SDK](https://developer.microsoft.com/en-US/windows/downloads/windows-10-sdk) signtool `Windows SDK Signing Tools for Desktop Apps` ~10MB
    * [Signing Installers You Create with Inno Setup](http://revolution.screenstepslive.com/s/revolution/m/10695/l/563371-signing-installers-you-create-with-inno-setup)
      * `"C:\Program Files (x86)\Windows Kits\10\bin\10.0.17763.0\x64\signtool.exe" sign /f "...cert.p12" /t http://timestamp.comodoca.com/authenticode /p MY_PASSWORD $f`
  * Recommended Scoop packages:
    * `busybox`
    * `concfg`
    * `clink`
    * `hack-font`
    * `vscode`

## How to build

  * install prerequisites
  * clone repository from GitHub (or unzip from release repository archive)
  * change to `bch-toolchain-windows` directory
  * `download`
  * `build`

---

Made with &#x2764;&nbsp; by [**HARDWARIO s.r.o.**](https://www.hardwario.com/) in the heart of Europe.
