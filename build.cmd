rem scoop update *
pip install pyinstaller --upgrade
pip install hbmqtt --upgrade
pip install bcf --upgrade
pip install bcg --upgrade
pip install bch --upgrade
cd script
if exist dist rmdir /s /q dist
if exist build rmdir /s /q build
pyinstaller -p "%USERPROFILE%\scoop\apps\python\current\Lib\site-packages\hbmqtt" -n hbmqtt hbmqttrun.py
pyinstaller -p "%USERPROFILE%\scoop\apps\python\current\Lib\site-packages\bcf" -n bcf bcfrun.py
pyinstaller -p "%USERPROFILE%\scoop\apps\python\current\Lib\site-packages\bch" -n bch bchrun.py
pyinstaller -p "%USERPROFILE%\scoop\apps\python\current\Lib\site-packages\bcg" -n bcg bcgrun.py
if exist dist\bc rmdir /s /q dist\tools
mkdir dist\tools
xcopy dist\bcf dist\tools
xcopy dist\bcg dist\tools /y
xcopy dist\bch dist\tools /y
xcopy dist\hbmqtt dist\tools /y
cd ..
git\mingw32\bin\busybox sed -i "s/autocrlf = true/autocrlf = false/g" git\mingw32\etc\gitconfig
"%USERPROFILE%\scoop\apps\innosetup-np\current\ISCC.exe" bch-toolchain-windows.iss
