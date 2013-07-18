cd /d %~dp0
cd ..

:: if output error status code of git: 128
git config --global url."https://".insteadOf git://
git clone git://github.com/jquery/jquery.git && npm install -g bower && cd jquery && npm install && bower install && grunt jquery_startup