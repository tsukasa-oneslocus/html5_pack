module.exports = function(grunt) {

	// ここに追加
	var pkg = grunt.file.readJSON('package.json');

	var detectDestType = function(dest) {
		if (grunt.util._.endsWith(dest, path.sep)) {
			return 'directory';
		} else {
			return 'file';
		}
	};

	'use strict';
	var path = require('path');
	var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

	var folderMount = function folderMount(connect, point) {
		return connect.static(path.resolve(point));
     };

	grunt.initConfig({
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
					'common/js/run.js': ['compile/*.coffee']
				}
			}
		},
		//-----------------------------------------------------------------------

		/* Scssのコンパイル
		------------------------------------------------------------------------*/
		compass: {
			dist: {
				options: {
					sassDir: 'compile',
					cssDir: 'common/css',
					imagesDir : 'common/img'
				}
			}
		},
		//-----------------------------------------------------------------------

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

		/* jsファイルの圧縮（ライセンス表記のコメントはコメント内容の先頭に@licenseを必ず表記してください！
		------------------------------------------------------------------------*/
		uglify: {
			options: {
				preserveComments: "some"
			},
			run: {
				src: ['common/all/run-all.js'],
				dest: 'common/all/run-all.min.js'
			}
		},
		/* cssファイルの圧縮
		------------------------------------------------------------------------*/
		cssmin: {
			style: {
				src: ['common/all/style-all.css'],
				dest: 'common/all/style-all.min.css'
			}
		},
		//-----------------------------------------------------------------------

		/* jsHintによるjsデバッグ。結果はコンソールに表示
		------------------------------------------------------------------------*/
		jshint: {
			options: {
				"curly": true,
				"eqnull": true,
				"eqeqeq": true,
				"undef": true,
				"globals": {
					"jQuery": true
				}
			},
			// 対象ファイルを指定
			all: ["common/js/run.js"]
		},
		//-----------------------------------------------------------------------

		/* 変更保存の監視。指定階層のcoffee,scss,css,jsの更新時にタスクを行う
		------------------------------------------------------------------------*/
		watch:{
			coffee:{
				files:['compile/*.coffee'],
				tasks:['coffee','jshint','concat:run','uglify']
			},
			compass:{
				files:['compile/*.scss'],
				tasks:['compass','concat:style','cssmin']
			}
		},
		//-----------------------------------------------------------------------

		/* livereload
        ------------------------------------------------------------------------*/
        // ブラウザ自動リロード用のサーバーを立てる設定
        connect: {
			livereload: {
				options: {
					port: 9001,
					middleware: function(connect, options) {
						return [lrSnippet, folderMount(connect, '.')];
					}
				}
			}
		},
        // 変更された場合に、tasksのタスクを実行する。
        regarde: {
			html: {
				// HTMLファイルが変更されたら、ブラウザリロード。
				files: ['*.html','../*.html','../../*.html','../../../*.html','../../../../*.html'],
				tasks: ['livereload']
			},
			css: {
				// CSSファイルが変更されたら、ブラウザリロード。
				files: 'common/all/style-all.min.css',
				tasks: ['livereload']
			}
		}
        //-----------------------------------------------------------------------
	});

	// Default task.
	// gruntコマンドを打つと走るタスクです。
	grunt.registerTask('default', ['coffee','compass','concat','uglify','cssmin','jshint']);
	// loadNpmTasksを変更（プラグイン読み込み）
	var taskName;
	for(taskName in pkg.devDependencies) {
		if(taskName.substring(0, 6) == 'grunt-') {
			grunt.loadNpmTasks(taskName);
		}
	}
};