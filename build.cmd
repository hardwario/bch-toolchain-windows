pip3 install pyinstaller --upgrade
pip3 install bcf --upgrade
if exist dist rmdir /s /q dist
pyinstaller -p "C:\Program Files (x86)\Python36-32\Lib\site-packages\bcf" --hidden-import github_repos -n bcf "C:\Program Files (x86)\Python36-32\Lib\site-packages\bcf\cli.py"
git\mingw32\bin\busybox sed -i "s/autocrlf = true/autocrlf = false/g" git\mingw32\etc\gitconfig
"C:\Program Files (x86)\Inno Setup 5\ISCC.exe" bch-toolchain-windows.iss
