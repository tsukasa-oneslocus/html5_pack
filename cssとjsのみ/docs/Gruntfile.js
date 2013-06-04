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
		/* js,cssファイルの結合
		------------------------------------------------------------------------*/
		concat: {
			style: {
				src: [
					'common/css/hogehoge.css',
					'common/css/hogehoge.css',
					'common/css/hogehoge.css'
				],
				dest: 'common/all/style-all.css'
			},
			run: {
				src: [
					'common/js/hogehoge.js',
					'common/js/hogehoge.js',
					'common/js/hogehoge.js',
					'common/js/hogehoge.js'
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
			css:{
				files:['common/css/*.css'],
				tasks:['concat:style','cssmin']
			},
			js:{
				files:['common/js/*.js'],
				tasks:['concat:run','uglify']
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
				files: ['*.html','*/*.html','*/*/*.html','*/*/*/*.html','*/*/*/*/*.html'],
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
	grunt.registerTask('default', ['concat','uglify','cssmin','jshint']);
	// loadNpmTasksを変更（プラグイン読み込み）
	var taskName;
	for(taskName in pkg.devDependencies) {
		if(taskName.substring(0, 6) == 'grunt-') {
			grunt.loadNpmTasks(taskName);
		}
	}
};