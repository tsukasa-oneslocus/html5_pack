set RUBYOPT=-EUTF-8
cd /d %~dp0
cd ..
:: change parent directory
grunt watch_files
:: watch start
cmd /k
