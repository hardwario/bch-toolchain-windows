pip install pyinstaller --upgrade
pip install bcf --upgrade
if exist dist rmdir /s /q dist
pyinstaller -p c:\python27\lib\site-packages\bcf\ --hidden-import github_repos -n bcf c:\python27\lib\site-packages\bcf\cli.py
busybox sed -i "s/autocrlf = true/autocrlf = false/g" mingw32\etc\gitconfig
"C:\Program Files (x86)\Inno Setup 5\ISCC.exe" bch-windows-toolchain.iss
