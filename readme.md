**html5_package with grunt.js**  
====================================================================
**Windows環境用batファイル付**  
  
update 2013.06.28  
tsukasa-oneslocus  
https://github.com/tsukasa-oneslocus  

***
  
###**概要**

簡単にgrunt.jsの設定・起動ができるファイル一式です。
また、html5の雛形となるhtmlとnormalize.css、modernizr.jsも同梱しています。
Gruntfile.jsを変更することで設定の変更やディレクトリの変更が可能です。

***

###**機能**  

* ディレクトリの初期構築・初期構築後の不要ファイル削除  
* CoffeeScriptのコンパイル  
* Sassのコンパイル  
* css/jsファイルの結合＆圧縮  
* jsHintによるデバッグ  
* watchによるファイル更新の監視→コンパイル・結合・圧縮・デバッグの自動化  
* 自動ブラウザリロード  
  
###**次期追加予定機能**  

* 画像圧縮  
* jQueryカスタムビルド  

***

###**諸注意**  

Gruntfileを設定せずにディレクトリをいじると基本的に動きません。  
  
※プラグイン等の著作権記述が必要なjsファイルはコメントのライセンス表記の前に必ず@licenseを記述してください。
これを記述することで圧縮時にライセンス記述コメントのみ残るようになります。

（例：  
`/* @license`  
`* Bootstrap.js by @fat & @mdo`  
`*`  
`* plugins: bootstrap-transition.js, bootstrap-dropdown.js, bootstrap-carousel.js`  
`* Copyright 2012 Twitter, Inc.`  
`* http://www.apache.org/licenses/LICENSE-2.0.txt`  
`*/`  

***

###**設定手順**  

※順番を必ず守りましょう。  

###**①Node.jsをインストール**  
http://nodejs.org/  

###**②gruntをインストール**  
Windowsは、キーボードで [win]+[r]を押して、「ファイル名を指定して実行」で cmd を入力。  
コマンドプロンプトが起動するはずです。  
起動したらすかさず  
`npm install -g grunt-cli`  
と入力してgruntをインストールしてください。  
管理権限等でエラーが出た人は管理者権限でcmdを起動してください。  

###**③ディレクトリ作成**  
パッケージ内に入っているdocsをディレクトリ内に配置します。docsがrootです。 

###**※Compassについて（Sassを使わない人は読み飛ばしていただいて大丈夫です）**  
Compass自体は通常通り@import "compass";で使えます。  
Compassのイメージディレクトリが/common/images/に設定されています。  
そのため、スプライトシートのインポートはディレクトリ通りにすると  
@import "sprite/*.png";になります。  

###**④プラグインのインストール**  
grunt_files/cmd_bat内のgrunt_install.batを叩いてください。
プラグイン等のインストールが始まります。node_modulesがgrunt_files内に生成されるはずです。

###**⑤ベースとなるディレクトリの生成**

grunt_files/cmd_bat内のgrunt_start.batを叩いてください。
ベースとなるディレクトリがdocs直下に生成されます。
この時に雛形のhtmlファイルとnormalize.cssとmodernizr.custom.jsが配置されます。

###**⑥Gruntfileの調整**

Gruntfile.jsの調整を行います。
CoffeeScriptを使う人は必ずjsの出力名を記述してください。
top-levelのfunctionで包括したい方はoptionの部分を消してください。

###**coffeeスクリプトのコンパイル**  

`coffee: {`  
`compile: {`  
`		//top-levelのfunctionを付けたい方はoptionを消してください。`  
`		options: {`   
`      			bare: true`  
`    		},`  
`		files:{`  
`			//coffeeからjsに出力する際のファイル名指定が必要です。`  
`			'common/js/hogehoge.js': ['compile/*.coffee']`  
`		}`  
`	}`  
`},`  

Gruntfile.jsを開き、結合したいcss,jsのパスを通します。  
上から順に結合されていくので、順番を間違えないようにしてください。  
ちなみにGrunt.jsにおいてルート相対・絶対パスは認識されません。  

###**js,cssファイルの結合**  

`concat: {`  
`	style: {`  
`		src: [`  
`			'common/css/hogehoge.css',`  
`			'common/css/hogehoge2.css',`  
`			'common/css/hogehoge3.css'`  
`		],`  
`		dest: 'common/all/style-all.css'`  
`	},`  
`	run: {`  
`		src: [`  
`			'common/js/hogehoge.js',`  
`			'common/js/hogehoge2.js',`  
`			'common/js/hogehoge3.js',`  
`			'common/js/hogehoge4.js'`  
`		],`  
`		dest: 'common/all/run-all.js'`  
`	}`  
`},`  

###**⑦タスクを走らせる**  

もしすでに制作が進んでいる状態でscss/css/coffee/jsが作成されている場合は、  
ファイルがディレクトリ通りに配置されているかを確認したうえでgrunt_command.batを叩いてください。  
一度コンパイル・結合・圧縮・デバッグが行われます。  
/common/all/配下に結合されたcss/jsファイルが入っていれば成功です。  

###**⑧ファイル監視を起動**

①～⑥が終わったら準備完了です。grunt_watch.batを叩いてください。  
Sublime Text2でlivereloadのプラグインを入れてる人は、バッティングするのでプラグインをremoveしてから使ってください。  
この後、コンソールは出したままにしておいてください。最小化しても大丈夫です。  
以降はscss/css/coffee/jsが更新される度に自動的にコンパイル・結合・圧縮・デバッグが行われます。  
さらに、htmlとcss(sassを使っている人はscss更新時)の更新時に自動でブラウザがリロードされます。  
コンソールは消さずに出したままにしておいてください。監視をやめたい場合はコンソール上でCtrl+Cを押してください。　　
任意のタイミングでコンパイル・結合・圧縮・デバッグを行いたい場合はgrunt_command.batを叩くか、  
コンソール上で「grunt」と打ち込んでください。　　

###**⑨SVNから設定ファイルを除外する**

レポジトリから各種設定ファイルを除外します。  
「右クリック→TortoiseSVN→バージョン管理から除外し、無視リストに追加」  
* grunt_filesフォルダ  

###**⑩firefoxまたはchromeに自動リロード用のアドオンorエクステンションを入れる**

**Firefox**  
http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-  
「Firefox extension」というやつです。  

**Chrome**  
https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei  

あとは追加されたアドオンのマークを押して、丸の中が赤くなれば成功です。  
後はhtmlまたはcss(sassの人はscss)を編集して保存した際にブラウザがリロードされればok。

***

**html5_packageについて**
====================================================================  
2013.05.10 tsukasa-oneslocus  
https://github.com/tsukasa-oneslocus  

***

backbone.jsを使うために作成した基本パッケージにhtml5のひな形とよく使われる基本ライブラリを格納したパッケージです。  
modenizrはカスタムで全ての機能を包括しているので、最終的に洗い出した機能を元にカスタムビルドし直してください。  
カスタムは http://modernizr.com からグレーのボタン「DEVELOPMENT」を押して、スクリプト作成ページに移動します。  

***

**Modernizrについて**
----------------------------------------
jsライブラリ。フィーチャーディテクションができます！！  

ブラウザによってサポートされている機能は毎回調べないと分かりません。  
しかし、このライブラリを使うことでブラウザで何が使えて、何が使えないかが分かります。  
html要素などでクラス"no-js"を使えば、今見ているブラウザでどれが使えてどれが使えないのかがhtml上に吐き出してくれます！  
css属性に目印をつけてくれるので、  

`.sample{`  
`     box-shadow...`  
`}`  

`html .no-boxshadow .sample{`  
`     ….`  
`}`  


と記述することで、属性非対応のものに対応することができます。  
しかも対応させる属性をカスタマイズしてビルドすることができるのです。  
使う属性だけチェックを入れれば大丈夫です。  

※IE8以下にもhtml5の要素を表示させることができるようになるライブラリ、「htmlshiv」も入っています。  

***

**Normalize.cssについて**
----------------------------------------

デフォルトCSSの不揃いを慣らしてくれるcssです。  
さらにデフォルトの矛盾を解消し、IE9において発生するSVGバグ等を解決してくれます。  
また、新要素にCSSのデフォルト値を設定してくれます。  
つまり、リセットの前段階の濾過掃除をしてくれるのです。  

あとは必要に応じてリセットしていけば効率的です。  