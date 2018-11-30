@if not defined PORT for /f "delims=," %%a in ('bcp') do set PORT=%%a
@set PORT=%PORT: =%
"%BigClownToolchain%\tools\bcg.exe" -d %PORT% %*
