@if not defined PORT for /f "delims=," %%a in ('bcp') do set PORT=%%a
@set PORT=%PORT: =%
@ping 127.0.0.1 -n 4 > nul
"%BigClownToolchain%\tools\bcg.exe" -d %PORT% %*
