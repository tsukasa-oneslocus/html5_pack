cd /d %~dp0
cd ..
cd jquery
:: select jquery version
git checkout tags/1.10.2
:: custom build command
grunt custom:-ajax