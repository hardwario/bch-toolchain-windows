## [v1.4.0](https://github.com/bigclownlabs/bch-toolchain-windows/releases/tag/v1.4.0) (2018-04-10)

* Change Make and BusyBox binary repository back to https://github.com/gnu-mcu-eclipse/windows-build-tools/ (semas to be more stable)
* Distinguish 32bit / 64bit installation for Make and BusyBox (32bit version crashes on 64bit Windows now on some instalations)
* Upgrade Build Tools to v2.10-20180103, GNU make to version 4.2.1
* Upgrade Python to 3.6.5
* Upgrade BigClown Firmware Tool bcf to v0.13.1
* Upgrade Git to v2.17.0
* Upgrade Clink to v0.4.9

## [v1.3.0](https://github.com/bigclownlabs/bch-toolchain-windows/releases/tag/v1.3.0) (2018-01-31)

* Add zadig.ini
* Upgrade BigClown Firmware Tool bcf to v0.11.0
* Upgrade Git to 2.16.1
* Upgrade GNU ARM Embedded Toolchain to 7-2017-q4-major
* Upgrade BusyBox to 1722-g096aee2bb

## [v1.2.2](https://github.com/bigclownlabs/bch-toolchain-windows/releases/tag/v1.2.2) (2017-12-29)

* Upgrade Python to 3.6.4

## [v1.2.1](https://github.com/bigclownlabs/bch-toolchain-windows/releases/tag/v1.2.1) (2017-12-19)

* Update DFU driver install

## [v1.2.0](https://github.com/bigclownlabs/bch-toolchain-windows/releases/tag/v1.2.0) (2017-12-08)

* Change Python to 3.6.3

## [v1.1.0](https://github.com/bigclownlabs/bch-toolchain-windows/releases/tag/v1.1.0) (2017-12-06)

* Change BusyBox binary repository to https://frippery.org/busybox/index.html (because of regular upgrades availability)
* Change Make binary repository to http://www.equation.com/servlet/equation.cmd?fa=make (there is more current version available)
* NOTE BusyBox and Make Windows binary repositories found thanks to https://github.com/lukesampson/scoop/tree/master/bucket
* Upgrade MinGit to 2.15.1.2
* Upgrade BigClown Firmware Tool to v0.7.0

## [v1.0.2](https://github.com/bigclownlabs/bch-toolchain-windows/releases/tag/v1.0.2) (2017-11-20)

* Add pnputil to DFU driver install 
* Set Unicode for console
* Fix DFU driver install - do not install libwdi driver if it is installed
* Upgrade Python to 2.7.14

## [v1.0.1](https://github.com/bigclownlabs/bch-toolchain-windows/releases/tag/v1.0.1) (2017-10-30)

* Upgrade MinGit 2.15.0
* Upgrade bcf v0.6.0
* Fix README.md indentation
* Rename to bch-toolchain-windows

## [v1.0.0](https://github.com/bigclownlabs/bch-toolchain-windows/releases/tag/v1.0.0) (2017-10-09)

* Add signtool
* Add cp for make

## [v1.0.0-rc5](https://github.com/bigclownlabs/bch-toolchain-windows/releases/tag/v1.0.0-rc5) (2017-10-06)

* Upgrade MinGit 2.14.2.2
* Add Clink v0.4.8

## [v1.0.0-rc4](https://github.com/bigclownlabs/bch-toolchain-windows/releases/tag/v1.0.0-rc4) (2017-10-05)

* Upgrade bcf v0.2.2
* Add tasks to add functionality components into Path
* Upgrade Git for Windows MinGit-busybox 2.14.2
* Change BigClown folder to BigClown Toolbox
* Change gnu folder to gcc
* Add title for cmd window
* Fix documentation slashes
* Move GNU Make from gcc subdirectory to make subdirectory
* Add uninstall paths from Path enviroment variable

## [v1.0.0-prerelease.3](https://github.com/bigclownlabs/bch-toolchain-windows/releases/tag/v1.0.0-prerelease.3) (2017-09-16)

* Should be fully functinal
* Change to cmd shell
* Split installation to subdirectories
* Update documentation
* Replace Makefile dependency sh with exe binary version `sh.exe`

## [v1.0.0-prerelease.2](https://github.com/bigclownlabs/bch-toolchain-windows/releases/tag/v1.0.0-prerelease.2) (2017-09-14)

* Fix Makefile dependencies (rm, cp)
* Upgrade bcf v0.2.1
* Add installation details documentation
* Add ISCC cli Inno Setup compiler into build.cmd
* Fix registry directory association quotation marks

## [v1.0.0-prerelease.1](https://github.com/bigclownlabs/bch-toolchain-windows/releases/tag/v1.0.0-prerelease.1) (2017-08-31)

Initial prerelease.