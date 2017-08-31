#define MyAppName "BigClown Toolchain"
#define MyAppVersion "1.0.0-prerelease.2"

[Setup]
PrivilegesRequired=admin
AppId={{61A8E34F-456F-4713-942B-E05CB737DA4F}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
;AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher="HARDWARIO s.r.o."
AppPublisherURL="https://www.hardwar.io/"
AppSupportURL="https://www.bigclown.com/contact/"
AppUpdatesURL="https://github.com/bigclownlabs/bch-windows-toolchain"
DefaultDirName={pf}\BigClown
DisableDirPage=yes
DisableProgramGroupPage=yes
OutputBaseFilename=bigclown-toolchain-setup-{#MyAppVersion}
Compression=lzma
SolidCompression=yes
UninstallDisplayIcon={app}\BigClown.ico
ChangesEnvironment=true
ChangesAssociations=true

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

; NOTE: Don't use "Flags: ignoreversion" on any shared system files
[Files]
Source: "BigClown.ico"; DestDir: "{app}"; Flags: ignoreversion
; LICENSE.txt from GNU GNU ARM Embedded Toolchain
Source: "LICENSE.txt"; DestDir: "{app}"; Flags: ignoreversion
; Keep LF in source code, DO NOT translate to CRLF!
Source: "config\.gitconfig"; DestDir: "{%USERPROFILE}"; Flags: ignoreversion onlyifdoesntexist uninsneveruninstall
; Busybox shell
Source: "script\sh.cmd"; DestDir: "{app}\cmd"; Flags: ignoreversion
; GNU make
Source: "GNU MCU Eclipse\Build Tools\2.9-20170629-1013\bin\make.exe"; DestDir: "{app}\cmd"; Flags: ignoreversion

; bcf
Source: "dist\bcf\*"; DestDir: "{app}\bcf"; Flags: ignoreversion
Source: "script\bcf.cmd"; DestDir: "{app}\cmd"; Flags: ignoreversion

; http://zadig.akeo.ie/ https://github.com/pbatard/libwdi
Source: "download\zadig-2.3.exe"; DestDir: "{app}\cmd"; DestName: "zadig.exe"; Flags: ignoreversion
; Multiple installations bloat PNP unfortunately, identify and delete all except one occurence
; pnputil /enumdrivers
; pnputil /deletedriver oemXX.inf
Source: "download\zadic.exe"; DestDir: "{app}\cmd"; Flags: ignoreversion
Source: "script\dfu-driver-install.cmd"; DestDir: "{app}\cmd"; Flags: ignoreversion
; http://www.st.com/en/development-tools/stsw-stm32102.html
Source: "download\Virtual Com port driver V1.4.0.msi"; DestDir: "{tmp}";
; https://sourceforge.net/projects/dfu-util/files/?source=navbar
Source: "download\dfu-util-static.exe"; DestDir: "{app}\cmd"; DestName: "dfu-util.exe"; Flags: ignoreversion

; Git
Source: "cmd\*"; DestDir: "{app}\cmd"; Flags: ignoreversion
Source: "etc\*"; DestDir: "{app}\etc"; Flags: ignoreversion recursesubdirs
Source: "mingw32\*"; DestDir: "{app}\mingw32"; Flags: ignoreversion recursesubdirs
Source: "usr\*"; DestDir: "{app}\usr"; Flags: ignoreversion recursesubdirs
; GNU ARM Embedded Toolchain
Source: "arm-none-eabi\*"; DestDir: "{app}\arm-none-eabi"; Flags: ignoreversion recursesubdirs
Source: "bin\*"; DestDir: "{app}\bin"; Flags: ignoreversion recursesubdirs
Source: "lib\*"; DestDir: "{app}\lib"; Flags: ignoreversion recursesubdirs
Source: "share\*"; DestDir: "{app}\share"; Flags: ignoreversion recursesubdirs

[Registry]
Root: HKLM; Subkey: "SYSTEM\CurrentControlSet\Control\Session Manager\Environment"; \
    ValueType: expandsz; ValueName: "BigClown"; ValueData: "{app}"; \

Root: HKLM; Subkey: "SYSTEM\CurrentControlSet\Control\Session Manager\Environment"; \
    ValueType: expandsz; ValueName: "Path"; ValueData: "{olddata};{app}\cmd"; \
    Check: NeedsAddPath('{app}\cmd')

Root: HKCU; Subkey: "SOFTWARE\Classes\directory\shell\BigClown"; ValueType: expandsz; ValueName: ""; ValueData: "Open with BC Toolchain"; Flags: uninsdeletekey
Root: HKCU; Subkey: "SOFTWARE\Classes\directory\shell\BigClown"; ValueType: expandsz; ValueName: "Icon"; ValueData: "{app}\BigClown.ico"; 
Root: HKCU; Subkey: "SOFTWARE\Classes\directory\shell\BigClown\command"; ValueType: expandsz; ValueName: ""; ValueData: """{app}\cmd\sh.cmd"""

[Icons]
Name: "{commonprograms}\{#MyAppName}"; Filename: "{app}\cmd\sh.cmd"; IconFilename: "{app}\BigClown.ico"; WorkingDir: "{%USERPROFILE}"

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
Filename: "{app}\cmd\dfu-driver-install.cmd"; \
    StatusMsg: "Installing DFU Driver"; \
    Flags: runhidden
; Install STM32 Virtual Com port driver
Filename: "msiexec.exe"; \
    Parameters: "/i ""{tmp}\Virtual Com port driver V1.4.0.msi"" /passive /norestart"; \
    StatusMsg: "Installing STM32 Virtual Com port driver";
