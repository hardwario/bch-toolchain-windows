rem scoop update *
pip3 install pyinstaller --upgrade
pip3 install bcf --upgrade
cd script
if exist dist rmdir /s /q dist
if exist build rmdir /s /q build
pyinstaller -p "C:\Users\michal\scoop\apps\python\current\Lib\site-packages\bcf" -n bcf bcfrun.py
cd ..
git\mingw32\bin\busybox sed -i "s/autocrlf = true/autocrlf = false/g" git\mingw32\etc\gitconfig
"C:\Program Files (x86)\Inno Setup 5\ISCC.exe" bch-toolchain-windows.iss
