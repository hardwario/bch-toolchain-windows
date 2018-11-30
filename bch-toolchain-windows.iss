#define MyAppName "BigClown Toolchain"
#define MyAppVersion "1.6.0"

[Setup]
SignTool=signtool
PrivilegesRequired=admin
AppId={{61A8E34F-456F-4713-942B-E05CB737DA4F}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher="HARDWARIO s.r.o."
AppPublisherURL="https://www.hardwario.com/"
AppSupportURL="https://www.bigclown.com/contact/"
AppUpdatesURL="https://github.com/bigclownlabs/bch-toolchain-windows"
UsePreviousAppDir=yes
DefaultDirName={pf}\BigClown Toolchain
DisableDirPage=no
DisableProgramGroupPage=yes
OutputBaseFilename=bch-toolchain-windows-v{#MyAppVersion}
Compression=lzma
SolidCompression=yes
UninstallDisplayIcon={app}\BigClown.ico
ChangesEnvironment=true
ChangesAssociations=true

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "add_script"; Description: "Add BigClown Toolchain scripts bct and tools into Path";
Name: "add_git"; Description: "Add Git and SSH (from Git) into Path"; Flags: unchecked
Name: "add_gcc"; Description: "Add GCC (GNU Arm Embedded Toolchain) into Path"; Flags: unchecked
Name: "add_make"; Description: "Add Make into Path"; Flags: unchecked
Name: "add_dfu"; Description: "Add DFU utils into Path"; Flags: unchecked

; NOTE: Don't use "Flags: ignoreversion" on any shared system files
[Files]
Source: "BigClown.ico"; DestDir: "{app}"; Flags: ignoreversion
; Keep LF in source code, DO NOT translate to CRLF!
Source: "config\.gitconfig"; DestDir: "{%USERPROFILE}"; Flags: ignoreversion onlyifdoesntexist uninsneveruninstall
Source: "README.md"; DestDir: "{app}"; Flags: ignoreversion

; Add script to start BigClown Toolchain shell
Source: "script\bct.cmd"; DestDir: "{app}\script"; Flags: ignoreversion
; Add script to start BigClown Sandbox
Source: "script\bcsb.cmd"; DestDir: "{app}\script"; Flags: ignoreversion
; Shotcut to start BusyBox shell
Source: "script\bb.cmd"; DestDir: "{app}\script"; Flags: ignoreversion

; BigClown tools
Source: "script\dist\tools\*"; DestDir: "{app}\tools"; Flags: ignoreversion
Source: "script\bcf.cmd"; DestDir: "{app}\script"; Flags: ignoreversion
Source: "script\bch.cmd"; DestDir: "{app}\script"; Flags: ignoreversion
Source: "script\bcg.cmd"; DestDir: "{app}\script"; Flags: ignoreversion
Source: "script\bcp.cmd"; DestDir: "{app}\script"; Flags: ignoreversion
; collection of Root Certificates for validating the trustworthiness of SSL certificates while verifying the identity of TLS hosts
Source: "..\scoop\apps\python36\current\Lib\site-packages\certifi\cacert.pem"; DestDir: "{app}\tools\certifi"; Flags: ignoreversion

; ConEmu
Source: "conemu\*"; DestDir: "{app}\conemu"; Flags: ignoreversion recursesubdirs

; MQTT Wall
Source: "mqtt-wall\*"; DestDir: "{app}\mqtt-wall"; Flags: ignoreversion recursesubdirs

#define Clink "clink_0.4.9_setup.exe"
Source: "{#Clink}"; DestDir: "{tmp}"

; USB UART FTDI Virtual COM Port Drivers
; http://www.ftdichip.com/Drivers/VCP.htm
Source: "CDM21228_Setup.exe"; DestDir: "{tmp}";

; USB UART ST Driver
; http://www.st.com/en/development-tools/stsw-stm32102.html
Source: "download\Virtual Com port driver V1.4.0.msi"; DestDir: "{tmp}";

; DFU
; http://zadig.akeo.ie/ https://github.com/pbatard/libwdi
Source: "download\zadig-2.4.exe"; DestDir: "{app}\dfu"; DestName: "zadig.exe"; Flags: ignoreversion
; Multiple installations bloat PNP unfortunately, identify and delete all except one occurence
; pnputil /enumdrivers
; pnputil /deletedriver oemXX.inf
Source: "script\zadig.ini"; DestDir: "{app}\dfu"; Flags: ignoreversion
Source: "download\zadic.exe"; DestDir: "{app}\dfu"; Flags: ignoreversion
Source: "script\dfu-driver-install.cmd"; DestDir: "{app}\dfu"; Flags: ignoreversion
; https://sourceforge.net/projects/dfu-util/files/?source=navbar
Source: "download\dfu-util-static.exe"; DestDir: "{app}\dfu"; DestName: "dfu-util.exe"; Flags: ignoreversion

; Git
Source: "git\LICENSE.txt"; DestDir: "{app}\git"; Flags: ignoreversion
Source: "git\cmd\*"; DestDir: "{app}\git\cmd"; Flags: ignoreversion
Source: "git\etc\*"; DestDir: "{app}\git\etc"; Flags: ignoreversion recursesubdirs
Source: "git\mingw32\*"; DestDir: "{app}\git\mingw32"; Flags: ignoreversion recursesubdirs
Source: "git\usr\*"; DestDir: "{app}\git\usr"; Flags: ignoreversion recursesubdirs

#define BuildTools "GNU MCU Eclipse\Build Tools\2.11-20180428-1604"
; GNU make
Source: "make\{#BuildTools}\bin\make.exe"; DestDir: "{app}\make"; Check: "not IsWin64"; Flags: ignoreversion 
Source: "make64\{#BuildTools}\bin\make.exe"; DestDir: "{app}\make"; Check: IsWin64; Flags: ignoreversion 
Source: "make\{#BuildTools}\gnu-mcu-eclipse\licenses\make-4.2.1\README"; DestName: "Make_README"; DestDir: "{app}\make"; Flags: ignoreversion
Source: "make\{#BuildTools}\gnu-mcu-eclipse\licenses\make-4.2.1\README.W32"; DestName: "Make_README.W32"; DestDir: "{app}\make"; Flags: ignoreversion
; Makefile dependencies from Git
Source: "make\{#BuildTools}\bin\busybox.exe"; DestName: "sh.exe"; DestDir: "{app}\make"; Check: "not IsWin64"; Flags: ignoreversion
Source: "make64\{#BuildTools}\bin\busybox.exe"; DestName: "sh.exe"; DestDir: "{app}\make"; Check: IsWin64; Flags: ignoreversion
Source: "make\{#BuildTools}\bin\busybox.exe"; DestName: "echo.exe"; DestDir: "{app}\make"; Check: "not IsWin64"; Flags: ignoreversion
Source: "make64\{#BuildTools}\bin\busybox.exe"; DestName: "echo.exe"; DestDir: "{app}\make"; Check: IsWin64; Flags: ignoreversion
Source: "make\{#BuildTools}\bin\busybox.exe"; DestName: "mkdir.exe"; DestDir: "{app}\make"; Check: "not IsWin64"; Flags: ignoreversion
Source: "make64\{#BuildTools}\bin\busybox.exe"; DestName: "mkdir.exe"; DestDir: "{app}\make"; Check: IsWin64; Flags: ignoreversion
Source: "make\{#BuildTools}\bin\busybox.exe"; DestName: "cp.exe"; DestDir: "{app}\make"; Check: "not IsWin64"; Flags: ignoreversion
Source: "make64\{#BuildTools}\bin\busybox.exe"; DestName: "cp.exe"; DestDir: "{app}\make"; Check: IsWin64; Flags: ignoreversion
Source: "make\{#BuildTools}\bin\busybox.exe"; DestName: "rm.exe"; DestDir: "{app}\make"; Check: "not IsWin64"; Flags: ignoreversion
Source: "make64\{#BuildTools}\bin\busybox.exe"; DestName: "rm.exe"; DestDir: "{app}\make"; Check: IsWin64; Flags: ignoreversion
Source: "make\{#BuildTools}\gnu-mcu-eclipse\licenses\busybox-w32\README"; DestName: "BusyBox_README"; DestDir: "{app}\make"; Flags: ignoreversion
Source: "make\{#BuildTools}\gnu-mcu-eclipse\licenses\busybox-w32\README.md"; DestName: "BusyBox_README.md"; DestDir: "{app}\make"; Flags: ignoreversion

; GNU ARM Embedded Toolchain
; LICENSE.txt from GNU GNU ARM Embedded Toolchain
Source: "gcc\arm-none-eabi\*"; DestDir: "{app}\gcc\arm-none-eabi"; Flags: ignoreversion recursesubdirs
Source: "gcc\bin\*"; DestDir: "{app}\gcc\bin"; Flags: ignoreversion recursesubdirs
Source: "gcc\lib\*"; DestDir: "{app}\gcc\lib"; Flags: ignoreversion recursesubdirs
Source: "gcc\share\*"; DestDir: "{app}\gcc\share"; Flags: ignoreversion recursesubdirs

[Registry]
; Store BigClown Toolchain installation directory into BigClown enviroment variable
Root: HKLM; Subkey: "SYSTEM\CurrentControlSet\Control\Session Manager\Environment"; \
    ValueType: expandsz; ValueName: "BigClownToolchain"; ValueData: "{app}"; Flags: uninsdeletevalue
Root: HKLM; Subkey: "SYSTEM\CurrentControlSet\Control\Session Manager\Environment"; \
    ValueType: expandsz; ValueName: "BigClownToolchainVersion"; ValueData: "{#MyAppVersion}"; Flags: uninsdeletevalue
; Add BigClown Toolchain tools scripts into Path
Root: HKLM; Subkey: "SYSTEM\CurrentControlSet\Control\Session Manager\Environment"; \
    ValueType: expandsz; ValueName: "Path"; ValueData: "{olddata};{app}\script"; \
    Check: NeedsAddPath('{app}\script'); Tasks: add_script
; Add Git and SSH into Path
Root: HKLM; Subkey: "SYSTEM\CurrentControlSet\Control\Session Manager\Environment"; \
    ValueType: expandsz; ValueName: "Path"; ValueData: "{olddata};{app}\git\cmd"; \
    Check: NeedsAddPath('{app}\git\cmd'); Tasks: add_git
Root: HKLM; Subkey: "SYSTEM\CurrentControlSet\Control\Session Manager\Environment"; \
    ValueType: expandsz; ValueName: "Path"; ValueData: "{olddata};{app}\git\usr\bin"; \
    Check: NeedsAddPath('{app}\git\usr\bin'); Tasks: add_git
; Add GCC into Path
Root: HKLM; Subkey: "SYSTEM\CurrentControlSet\Control\Session Manager\Environment"; \
    ValueType: expandsz; ValueName: "Path"; ValueData: "{olddata};{app}\gcc\bin"; \
    Check: NeedsAddPath('{app}\gcc\bin'); Tasks: add_gcc
; Add Make into Path
Root: HKLM; Subkey: "SYSTEM\CurrentControlSet\Control\Session Manager\Environment"; \
    ValueType: expandsz; ValueName: "Path"; ValueData: "{olddata};{app}\make"; \
    Check: NeedsAddPath('{app}\make'); Tasks: add_make
; Add DFU utils into Path
Root: HKLM; Subkey: "SYSTEM\CurrentControlSet\Control\Session Manager\Environment"; \
    ValueType: expandsz; ValueName: "Path"; ValueData: "{olddata};{app}\dfu"; \
    Check: NeedsAddPath('{app}\dfu'); Tasks: add_dfu

; right-click on folder
Root: HKLM; Subkey: "SOFTWARE\Classes\directory\shell\BigClown"; ValueType: expandsz; ValueName: ""; ValueData: "Open with {#MyAppName}"; Flags: uninsdeletekey
Root: HKLM; Subkey: "SOFTWARE\Classes\directory\shell\BigClown"; ValueType: expandsz; ValueName: "Icon"; ValueData: "{app}\BigClown.ico"; 
Root: HKLM; Subkey: "SOFTWARE\Classes\directory\shell\BigClown\command"; ValueType: expandsz; ValueName: ""; \
    ValueData: """{win}\system32\cmd.exe"" /K """"{app}\script\bct.cmd"" ""%V"""""
; right-click in folder
Root: HKLM; Subkey: "SOFTWARE\Classes\directory\background\shell\BigClown"; ValueType: expandsz; ValueName: ""; ValueData: "Open with {#MyAppName}"; Flags: uninsdeletekey
Root: HKLM; Subkey: "SOFTWARE\Classes\directory\background\shell\BigClown"; ValueType: expandsz; ValueName: "Icon"; ValueData: "{app}\BigClown.ico"
Root: HKLM; Subkey: "SOFTWARE\Classes\directory\background\shell\BigClown\command"; ValueType: expandsz; ValueName: ""; \
    ValueData: """{win}\system32\cmd.exe"" /K """"{app}\script\bct.cmd"" ""%V"""""

[Icons]
Name: "{commonprograms}\{#MyAppName}"; Filename: "{win}\system32\cmd.exe"; IconFilename: "{app}\BigClown.ico"; \
    Parameters: "/K ""{app}\script\bct.cmd"""; WorkingDir: "{%USERPROFILE}"
Name: "{commondesktop}\{#MyAppName}"; Filename: "{win}\system32\cmd.exe"; IconFilename: "{app}\BigClown.ico"; \
    Parameters: "/K ""{app}\script\bct.cmd"""; WorkingDir: "{%USERPROFILE}"
Name: "{commonprograms}\BigClown Sandbox"; Filename: "{win}\system32\cmd.exe"; IconFilename: "{app}\BigClown.ico"; \
    Parameters: "/C ""{app}\script\bcsb.cmd"""; WorkingDir: "{%USERPROFILE}"
Name: "{commondesktop}\BigClown Sandbox"; Filename: "{win}\system32\cmd.exe"; IconFilename: "{app}\BigClown.ico"; \
    Parameters: "/C ""{app}\script\bcsb.cmd"""; WorkingDir: "{%USERPROFILE}"

[Code]
const
  EnvironmentKey = 'SYSTEM\CurrentControlSet\Control\Session Manager\Environment';

{WARNING works for set of paths who are not substrings to each other}
function NeedsAddPath(Param: string): boolean;
var
  OrigPath: string;
begin
  if not RegQueryStringValue(HKEY_LOCAL_MACHINE, EnvironmentKey, 'Path', OrigPath)
  then begin
    Result := True;
    exit;
  end;
  { look for the path with leading semicolon}
  { Pos() returns 0 if not found }
  Log('PATH: ' +  ExpandConstant(Param));
  Result := Pos(';' + ExpandConstant(Param), ';' + OrigPath) = 0;
end;

{WARNING works for set of paths who are not substrings to each other}
procedure RemovePath(Path: string);
var
  Paths: string;
  P: Integer;
begin
  if not RegQueryStringValue(HKEY_LOCAL_MACHINE, EnvironmentKey, 'Path', Paths) then
  begin
    Log('PATH not found');
  end
    else
  begin
    Log(Format('PATH is [%s]', [Paths]));

    P := Pos(';' + Uppercase(Path), ';' + Uppercase(Paths));
    if P = 0 then
    begin
      Log(Format('Path [%s] not found in PATH', [Path]));
    end
      else
    begin
      Delete(Paths, P - 1, Length(Path) + 1);
      Log(Format('Path [%s] removed from PATH => [%s]', [Path, Paths]));

      if RegWriteStringValue(HKEY_LOCAL_MACHINE, EnvironmentKey, 'Path', Paths) then
      begin
        Log('PATH written');
      end
        else
      begin
        Log('Error writing PATH');
      end;
    end;
  end;
end;

procedure CurUninstallStepChanged(CurUninstallStep: TUninstallStep);
begin
  if CurUninstallStep = usPostUninstall then
  begin
    RemovePath(ExpandConstant('{app}\script'));
    RemovePath(ExpandConstant('{app}\git\cmd'));
    RemovePath(ExpandConstant('{app}\git\usr\bin'));
    RemovePath(ExpandConstant('{app}\gcc\bin'));
    RemovePath(ExpandConstant('{app}\make'));
    RemovePath(ExpandConstant('{app}\dfu'));
  end;
end;

[Run]
; Install Clink
Filename: "{tmp}\{#Clink}"; \
    Parameters: "/S"; \
    StatusMsg: "Installing {#Clink}";
; Install DFU Drivers
Filename: "{app}\dfu\dfu-driver-install.cmd"; \
    WorkingDir: "{app}\dfu"; \
    StatusMsg: "Installing DFU Driver"; \
    Flags: runhidden
; Install USB UART STM32 Virtual COM Port Driver
Filename: "msiexec.exe"; \
    Parameters: "/i ""{tmp}\Virtual Com Port Driver V1.4.0.msi"" /passive /norestart"; \
    StatusMsg: "Installing usb uart STM32 Virtual COM Port Driver";
; Install USB UART FTDI Virtual COM Port Drivers
Filename: "{tmp}\CDM21228_Setup.exe"; \
    StatusMsg: "Installing USB UART FTDI Virtual COM Port Drivers";
; Enable Windows firewall for hbmqtt
; https://technet.microsoft.com/en-us/library/dd734783(v=ws.10).aspx
Filename: "netsh.exe"; Parameters: "advfirewall firewall delete rule name=hbmqtt"; \
    StatusMsg: "Deleting Windows firewall rules for hbmqtt"; Flags: runhidden
Filename: "netsh.exe"; Parameters: "advfirewall firewall add rule name=hbmqtt dir=in action=allow program=""{app}\tools\hbmqtt.exe"" protocol=tcp profile=any edge=deferuser"; \
    StatusMsg: "Enabling Windows firewall for hbmqtt"; \
    Flags: runhidden
; netsh advfirewall firewall show rule name=hbmqtt

[UninstallDelete]
Type: filesandordirs; Name: "{app}"
