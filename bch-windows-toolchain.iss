#define MyAppName "BigClown Toolchain"
#define MyAppVersion "1.0.0-prerelease.3"

[Setup]
PrivilegesRequired=admin
AppId={{61A8E34F-456F-4713-942B-E05CB737DA4F}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
;AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher="HARDWARIO s.r.o."
AppPublisherURL="https://www.hardwario.com/"
AppSupportURL="https://www.bigclown.com/contact/"
AppUpdatesURL="https://github.com/bigclownlabs/bch-windows-toolchain"
UsePreviousAppDir=yes
DefaultDirName={pf}\BigClown
DisableDirPage=no
DisableProgramGroupPage=yes
OutputBaseFilename=BigClown-toolchain-setup-{#MyAppVersion}
Compression=lzma
SolidCompression=yes
UninstallDisplayIcon={app}\BigClown.ico
ChangesEnvironment=true
ChangesAssociations=true

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "addpath"; Description: "Add BigClown Toolchain into Path"; Flags: checkedonce

; NOTE: Don't use "Flags: ignoreversion" on any shared system files
[Files]
Source: "BigClown.ico"; DestDir: "{app}"; Flags: ignoreversion
; Keep LF in source code, DO NOT translate to CRLF!
Source: "config\.gitconfig"; DestDir: "{%USERPROFILE}"; Flags: ignoreversion onlyifdoesntexist uninsneveruninstall
; Busybox shell
Source: "script\bct.cmd"; DestDir: "{app}\bct"; Flags: ignoreversion

; GNU make
Source: "GNU MCU Eclipse\Build Tools\2.9-20170629-1013\bin\make.exe"; DestDir: "{app}\gnu\bin"; Flags: ignoreversion
; Makefile dependencies from Git
Source: "GNU MCU Eclipse\Build Tools\2.9-20170629-1013\bin\sh.exe"; DestDir: "{app}\gnu\bin"; Flags: ignoreversion
;Source: "GNU MCU Eclipse\Build Tools\2.9-20170629-1013\bin\echo.exe"; DestDir: "{app}\gnu\bin"; Flags: ignoreversion
;Source: "GNU MCU Eclipse\Build Tools\2.9-20170629-1013\bin\mkdir.exe"; DestDir: "{app}\gnu\bin"; Flags: ignoreversion
;Source: "GNU MCU Eclipse\Build Tools\2.9-20170629-1013\bin\rm.exe"; DestDir: "{app}\gnu\bin"; Flags: ignoreversion

; BigClown Firmware Utility
Source: "dist\bcf\*"; DestDir: "{app}\bcf"; Flags: ignoreversion
Source: "script\bcf.cmd"; DestDir: "{app}\bct"; Flags: ignoreversion

; DFU
; http://zadig.akeo.ie/ https://github.com/pbatard/libwdi
Source: "download\zadig-2.3.exe"; DestDir: "{app}\dfu"; DestName: "zadig.exe"; Flags: ignoreversion
; Multiple installations bloat PNP unfortunately, identify and delete all except one occurence
; pnputil /enumdrivers
; pnputil /deletedriver oemXX.inf
Source: "download\zadic.exe"; DestDir: "{app}\dfu"; Flags: ignoreversion
Source: "script\dfu-driver-install.cmd"; DestDir: "{app}\dfu"; Flags: ignoreversion
; https://sourceforge.net/projects/dfu-util/files/?source=navbar
Source: "download\dfu-util-static.exe"; DestDir: "{app}\dfu"; DestName: "dfu-util.exe"; Flags: ignoreversion

; USB UART ST Driver
; http://www.st.com/en/development-tools/stsw-stm32102.html
Source: "download\Virtual Com port driver V1.4.0.msi"; DestDir: "{tmp}";

; Git
Source: "cmd\*"; DestDir: "{app}\git\cmd"; Flags: ignoreversion
Source: "etc\*"; DestDir: "{app}\git\etc"; Flags: ignoreversion recursesubdirs
Source: "mingw32\*"; DestDir: "{app}\git\mingw32"; Flags: ignoreversion recursesubdirs
Source: "usr\*"; DestDir: "{app}\git\usr"; Flags: ignoreversion recursesubdirs
; GNU ARM Embedded Toolchain
; LICENSE.txt from GNU GNU ARM Embedded Toolchain
Source: "LICENSE.txt"; DestDir: "{app}\gnu"; Flags: ignoreversion
Source: "arm-none-eabi\*"; DestDir: "{app}\gnu\arm-none-eabi"; Flags: ignoreversion recursesubdirs
Source: "bin\*"; DestDir: "{app}\gnu\bin"; Flags: ignoreversion recursesubdirs
Source: "lib\*"; DestDir: "{app}\gnu\lib"; Flags: ignoreversion recursesubdirs
Source: "share\*"; DestDir: "{app}\gnu\share"; Flags: ignoreversion recursesubdirs

[Registry]
; add BigClown Toolchain to Path
Root: HKLM; Subkey: "SYSTEM\CurrentControlSet\Control\Session Manager\Environment"; \
    ValueType: expandsz; ValueName: "BigClown"; ValueData: "{app}"; Tasks: addpath
Root: HKLM; Subkey: "SYSTEM\CurrentControlSet\Control\Session Manager\Environment"; \
    ValueType: expandsz; ValueName: "Path"; ValueData: "{olddata};{app}\bct"; \
    Check: NeedsAddPath('{app}\bct'); Tasks: addpath

; right-click on folder
Root: HKCU; Subkey: "SOFTWARE\Classes\directory\shell\BigClown"; ValueType: expandsz; ValueName: ""; ValueData: "Open with {#MyAppName}"; Flags: uninsdeletekey
Root: HKCU; Subkey: "SOFTWARE\Classes\directory\shell\BigClown"; ValueType: expandsz; ValueName: "Icon"; ValueData: "{app}\BigClown.ico"; 
Root: HKCU; Subkey: "SOFTWARE\Classes\directory\shell\BigClown\command"; ValueType: expandsz; ValueName: ""; \
    ValueData: """{win}\system32\cmd.exe"" /K """"{app}\bct\bct.cmd"" ""%V"""""
; right-click in folder
Root: HKCU; Subkey: "SOFTWARE\Classes\directory\background\shell\BigClown"; ValueType: expandsz; ValueName: ""; ValueData: "Open with {#MyAppName}"; Flags: uninsdeletekey
Root: HKCU; Subkey: "SOFTWARE\Classes\directory\background\shell\BigClown"; ValueType: expandsz; ValueName: "Icon"; ValueData: "{app}\BigClown.ico"
Root: HKCU; Subkey: "SOFTWARE\Classes\directory\background\shell\BigClown\command"; ValueType: expandsz; ValueName: ""; \
    ValueData: """{win}\system32\cmd.exe"" /K """"{app}\bct\bct.cmd"" ""%V"""""

[Icons]
Name: "{commonprograms}\{#MyAppName}"; Filename: "{win}\system32\cmd.exe"; IconFilename: "{app}\BigClown.ico"; \
    Parameters: "/K ""{app}\bct\bct.cmd"""; WorkingDir: "{%USERPROFILE}"
Name: "{commondesktop}\{#MyAppName}"; Filename: "{win}\system32\cmd.exe"; IconFilename: "{app}\BigClown.ico"; \
    Parameters: "/K ""{app}\bct\bct.cmd"""; WorkingDir: "{%USERPROFILE}"

[Code]
function NeedsAddPath(Param: string): boolean;
var
  OrigPath: string;
begin
  if not RegQueryStringValue(HKEY_LOCAL_MACHINE, 
    'SYSTEM\CurrentControlSet\Control\Session Manager\Environment', 
    'Path', OrigPath)
  then begin
    Result := True;
    exit;
  end;
  { look for the path with leading and trailing semicolon }
  { Pos() returns 0 if not found }
  Log('PATH: ' +  ExpandConstant(Param));
  Result := Pos(';' + ExpandConstant(Param) + ';', ';' + OrigPath + ';') = 0;
end;

[Run]
; Install DFU Drivers
Filename: "{app}\dfu\dfu-driver-install.cmd"; \
    StatusMsg: "Installing DFU Driver"; \
    Flags: runhidden
; Install STM32 Virtual COM Port Driver
Filename: "msiexec.exe"; \
    Parameters: "/i ""{tmp}\Virtual COM Port Driver V1.4.0.msi"" /passive /norestart"; \
    StatusMsg: "Installing STM32 Virtual Com port driver";
