<a href="https://www.bigclown.com/"><img src="https://bigclown.sirv.com/logo.png" width="200" height="59" alt="BigClown Logo" align="right"></a>

# BigClown Firmware Windows Toolchain  
For Microsoft Windows 7, 8, 10 (32bit and 64bit).

Toolchain is based on [BusyBox](https://busybox.net/about.html) environment, Git, GNU C, GNU Make.

Default install destination directory is `%ProgramFiles(x86)%` on 64bit OS or into `%ProgramFiles%` on 32bit OS (can be changed by user during installation).
Defines [HKLM](https://www.google.com/search?q=hklm) environment variable `%BigClownToolchain%` pointing to top level directory of installation.

Adds by default during first installation `%BigClownToolchain%\script` at the end of `%Path%` (can be deselected during installation) on HKLM level. That allows to use `bct` and `bcf` from anywhere.

If you like to use different version of Git, GNU C or other tools, just use your favourite direcotry before BigClown installation in `%Path%` (e.g. change paths in `bct.cmd` or just copy `bct.cmd`, modify paths and use that modified script to define another paths). 

Scripts/binaries for toolchain executables:

  * **Daily use** - for documentation have a look at [BigClown Documentation](https://doc.bigclown.com/)
    * BigClown Toolchain scripts
      * `script\bct.cmd` - Entry into BigClown Toolchain - adds Git, GCC, DFU paths at the beginning of `%Path%`. You can pass directory as first parametr to change to working directory.
      * `script\bcf.cmd` - Executes BigClown Firmware Tool (implemented in Python and packed by PyInstaller)
      * `script\bb.cmd` - Executes BusyBox shell (for users who likes Linux shell environment)
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
  * [BigClown Firmware Flasher v0.19.0](https://github.com/bigclownlabs/bch-firmware-flasher/)
    * `bcf\bcf.exe` - Python script packed with [PyInstaller](http://www.pyinstaller.org/)
  * [Git for Windows MinGit-busybox 2.18.0](https://github.com/git-for-windows/git/)
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
  * [FTDI Virtual COM Port Drivers 2.12.28](http://www.ftdichip.com/Drivers/VCP.htm)
  * [dfu-util-static v0.8](https://sourceforge.net/projects/dfu-util/files/dfu-util-0.8-binaries/win32-mingw32/)
  * [libwdi v1.2.5](https://github.com/pbatard/libwdi) WinUSB drivers for STM32 DFU
  * [Zadig v2.4](http://zadig.akeo.ie/) USB driver check&fix for STM32 DFU
  * [STM32 Virtual COM Port Driver v1.4.0](http://www.st.com/en/development-tools/stsw-stm32102.html)

## Build prerequisites

  * Microsoft Windows 7, 8, 10 (`cmd` shell)
  * [7-Zip](http://www.7-zip.org/) installed by [Scoop](https://scoop.sh/)
  * [Python](https://www.python.org/) 3.6.6 32bit installed by [Scoop](https://scoop.sh/) 
  * [Inno Setup v5.5.9](http://www.jrsoftware.org/isinfo.php)
  * [Windows 10 SDK](https://go.microsoft.com/fwlink/?LinkID=698771) signtool
    * [Signing Installers You Create with Inno Setup](http://revolution.screenstepslive.com/s/revolution/m/10695/l/563371-signing-installers-you-create-with-inno-setup)
      * `"C:\Program Files (x86)\Windows Kits\10\bin\x64\signtool.exe" sign /f "...\cert.p12" /t http://timestamp.comodoca.com/authenticode /p MY_PASSWORD $f`

## How to build

  * install prerequisites
  * clone repository from GitHub (or unzip from release repository archive)
  * change to `bch-toolchain-windows` directory
  * `download`
  * `build`

---

Made with &#x2764;&nbsp; by [**HARDWARIO s.r.o.**](https://www.hardwario.com/) in the heart of Europe.
