////////////////////////////////////////////////////////////////////
html5_package with grunt.js
Windows環境用batファイル付

update 2013.05.14
tsukasa-oneslocus
https://github.com/tsukasa-oneslocus
////////////////////////////////////////////////////////////////////

--------------------------------------------------------------------
概要
--------------------------------------------------------------------
簡単にgrunt.jsの設定・起動ができるファイル一式です。
Gruntfile.jsを変更することで設定の変更やディレクトリの変更が可能です。

--------------------------------------------------------------------
機能
--------------------------------------------------------------------
・CoffeeScriptのコンパイル
・Sassのコンパイル
・css/jsファイルの結合＆圧縮
・jsHintによるデバッグ
・watchによるファイル更新の監視→コンパイル・結合・圧縮・デバッグの自動化
・自動ブラウザリロード

--------------------------------------------------------------------
諸注意
--------------------------------------------------------------------
事前の知識無しにディレクトリ構造を変更すると、まず動かないと思っていただいて大丈夫です。
batファイルやpackage.jsonやGruntfile.jsも必ずdocs直下で置くようにしてください。

※プラグイン等の著作権記述が必要なjsファイルはコメントのライセンス表記の前に必ず@licenseを記述してください。
これを記述することで圧縮時にライセンス記述コメントのみ残るようになります。

（例：
/* @license
 * Bootstrap.js by @fat & @mdo
 *
 * plugins: bootstrap-transition.js, bootstrap-dropdown.js, bootstrap-carousel.js
 * Copyright 2012 Twitter, Inc.
 * http://www.apache.org/licenses/LICENSE-2.0.txt
 */

--------------------------------------------------------------------
設定手順
--------------------------------------------------------------------
※順番を必ず守りましょう。

①Node.jsをインストール
http://nodejs.org/

②gruntをインストール
Windowsは、キーボードで [win]+[r]を押して、「ファイル名を指定して実行」で cmd を入力。
コマンドプロンプトが起動するはずです。
起動したらすかさず
-----------------------------
npm install -g grunt-cli
-----------------------------
と入力してgruntをインストールしてください。
管理権限等でエラーが出た人は管理者権限でcmdを起動してください。


③ディレクトリ作成
パッケージ内に入っているdocsをディレクトリ内に配置します。docsがrootです。
すでにディレクトリを作成済みの場合は、パッケージ内のディレクトリと同じになるようにマージしてください。
ディレクトリの説明についてはパッケージ内のpptを参照してください。

※Compassについて（Sassを使わない人は読み飛ばしていただいて大丈夫です）
------------------------------------------------------------------
Compass自体は通常通り@import "compass";で使えます。
Compassのイメージディレクトリが/common/images/に設定されています。
そのため、スプライトシートのインポートはディレクトリ通りにすると
@import "sprite/*.png";になります。


④プラグインのインストール
root直下のgrunt_install.batを叩いてください。
プラグイン等のインストールが始まります。node_modulesが直下に生成されるはずです。


⑤Gruntfile.jsの調整

CoffeeScriptを使う人は必ずjsの出力名を記述してください。
top-levelのfunctionで包括したい方はoptionの部分を消してください。

/* coffeeスクリプトのコンパイル
------------------------------------------------------------------------*/
coffee: {
	compile: {
		//top-levelのfunctionを付けたい方はoptionを消してください。
		options: {
      			bare: true
    		},
		files:{
			//coffeeからjsに出力する際のファイル名指定が必要です。
			'common/js/hogehoge.js': ['compile/*.coffee']
		}
	}
},
//-----------------------------------------------------------------------

Gruntfile.jsを開き、結合したいcss,jsのパスを通します。
上から順に結合されていくので、順番を間違えないようにしてください。
ちなみにGrunt.jsにおいてルート相対・絶対パスは認識されません。

/* js,cssファイルの結合
------------------------------------------------------------------------*/
concat: {
	style: {
		src: [
			'common/css/hogehoge.css',
			'common/css/hogehoge2.css',
			'common/css/hogehoge3.css'
		],
		dest: 'common/all/style-all.css'
	},
	run: {
		src: [
			'common/js/hogehoge.js',
			'common/js/hogehoge2.js',
			'common/js/hogehoge3.js',
			'common/js/hogehoge4.js'
		],
		dest: 'common/all/run-all.js'
	}
},
//-----------------------------------------------------------------------


⑥タスクを走らせる
もしすでに制作が進んでいる状態でscss/css/coffee/jsが作成されている場合は、
ファイルがディレクトリ通りに配置されているかを確認したうえでgrunt_command.batを叩いてください。
一度コンパイル・結合・圧縮・デバッグが行われます。
/common/all/配下に結合されたcss/jsファイルが入っていれば成功です。


⑦ファイル監視を起動
①～⑥が終わったら準備完了です。grunt_watch.batとgrunt_livereloadを叩いてください。
Sublime Text2でlivereloadのプラグインを入れてる人は、バッティングするのでプラグインをremoveしてから使ってください。
この後、コンソールは出したままにしておいてください。最小化しても大丈夫です。
以降はscss/css/coffee/jsが更新される度に自動的にコンパイル・結合・圧縮・デバッグが行われます。
さらに、htmlとcss(sassを使っている人はscss更新時)の更新時に自動でブラウザがリロードされます。
コンソールは消さずに出したままにしておいてください。監視をやめたい場合はコンソール上でCtrl+Cを押してください。
任意のタイミングでコンパイル・結合・圧縮・デバッグを行いたい場合はgrunt_command.batを叩くか、
コンソール上で「grunt」と打ち込んでください。


⑧SVNから設定ファイルを除外する
レポジトリから各種設定ファイルを除外します。
「右クリック→TortoiseSVN→バージョン管理から除外し、無視リストに追加」
・package.json
・Gruntfile.js
・grunt_command.bat
・grunt_install.bat
・grunt_watch.bat
・grunt_livereload.bat
・node_modulesフォルダ
・.sass-cacheフォルダ（Sass使用者のみ）

⑨firefoxまたはchromeに自動リロード用のアドオンorエクステンションを入れる

Firefox
http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-
「Firefox extension」というやつです。

Chrome
https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei

あとは追加されたアドオンのマークを押して、丸の中が赤くなれば成功です。
後はhtmlまたはcss(sassの人はscss)を編集して保存した際にブラウザがリロードされればok。

⑨別の案件で使うときは
③～⑧を繰り返せば大丈夫です。
