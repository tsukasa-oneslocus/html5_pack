var path = require('path');

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

	// パスの設定
	var pathConfig = {
		vh: 'Please input VH',		// バーチャルホストのサーバー名
		root: '../docs',				// project root
		src: 'common',				// 共通リソースの配置先
		compile: 'common/compile'	// コンパイル言語ソース類の配置先
	};

	grunt.initConfig({

		/* パス設定のロード
		 ---------------------------------------------------*/
		path: pathConfig,

		/* typescriptのコンパイル
		 ------------------------------------------------------------------------*/
		typescript: {
			base: {
				src: ['<%= path.root %>/<%= path.compile %>/*.ts'],
				dest: '<%= path.root %>/<%= path.src %>/js',
				options: {
					base_path: '<%= path.root %>/<%= path.compile %>'
				}
			}
		},
		//-----------------------------------------------------------------------

		/* coffeescriptのコンパイル
		 ------------------------------------------------------------------------*/
		coffee: {
			compile: {
				//top-levelのfunctionを付けたい方はoptionを消してください。
				options: {
					bare: true
				},
				expand: true,
				flatten: true,
				cwd: '<%= path.root %>/<%= path.compile %>',
				src: ['*.coffee'],
				dest: '<%= path.root %>/<%= path.src %>/js',
				ext: '.js'
			}
		},
		//-----------------------------------------------------------------------

		/* Scssのコンパイル
		 ------------------------------------------------------------------------*/
		compass: {
			dist: {
				options: {
					basePath: '<%= path.root %>/',
					sassDir: '<%= path.compile %>',
					cssDir: '<%= path.src %>/css',
					//compassのimgディレクトリ（スプライトを書き出すディレクトリ
					imagesDir : '<%= path.src %>/img',
					config: 'config.rb'
				}
			}
		},
		//-----------------------------------------------------------------------

		/* js,cssファイルの結合
		 ------------------------------------------------------------------------*/
		concat: {
			style: {
				src: [
					'<%= path.root %>/<%= path.src %>/css/normalize.css',
					'<%= path.root %>/<%= path.src %>/css/hogehoge.css',
					'<%= path.root %>/<%= path.src %>/css/hogehoge2.css'
				],
				dest: '<%= path.root %>/<%= path.src %>/all/style-all.css'
			},
			run: {
				src: [
					'<%= path.root %>/<%= path.src %>/js/modernizr.custom.js',
					'<%= path.root %>/<%= path.src %>/js/hogehoge.js',
					'<%= path.root %>/<%= path.src %>/js/hogehoge2.js'
				],
				dest: '<%= path.root %>/<%= path.src %>/all/run-all.js'
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
				src: ['<%= path.root %>/<%= path.src %>/all/run-all.js'],
				dest: '<%= path.root %>/<%= path.src %>/all/run-all.min.js'
			}
		},
		/* cssファイルの圧縮
		 ------------------------------------------------------------------------*/
		cssmin: {
			style: {
				src: ['<%= path.root %>/<%= path.src %>/all/style-all.css'],
				dest: '<%= path.root %>/<%= path.src %>/all/style-all.min.css'
			}
		},
		//-----------------------------------------------------------------------

		/* cssプロパティの並び替え
		 ------------------------------------------------------------------------*/
		csscomb: {
			dist: {
				files: {
					'<%= path.root %>/<%= path.src %>/all/style-all.css': ['<%= path.root %><%= path.src %>/all/style-all.css']
				}
			}
		},
		//-----------------------------------------------------------------------

		/* jsHintによるjsデバッグ。結果はコンソールに表示
		 ------------------------------------------------------------------------*/
		jshint: {
			// 対象ファイルを指定
			all: ["<%= path.root %>/<%= path.src %>/js/run.js"]
		},
		//-----------------------------------------------------------------------

		/* 画像最適化
		 ---------------------------------------------------*/
		imagemin: {
			dist: {
				options: {
					optimizationLevel: 3
				},
				files: [{
					expand: true,
					src: [
						'<%= path.root %>/**/*.{png, jpg, jpeg}','<%= path.root %>/**/**/*.{png, jpg, jpeg}','<%= path.root %>/**/**/**/*.{png, jpg, jpeg}'
					]
				}]
			}
		},
		//-----------------------------------------------------------------------

		/* webfont作成
		 ------------------------------------------------------------------------*/
		webfont: {
			icons: {
				src: '<%= path.root %>/<%= path.src %>/fonts/icons/*.svg',
				dest: '<%= path.root %>/<%= path.src %>/fonts',
				destCss: '<%= path.root %>/<%= path.compile %>',
				options: {
					font: 'custom-fonts',
					stylesheet:'scss',
					htmlDemo: false,
					relativeFontPath: '/<%= path.src %>/fonts'
				}
			}
		},
		//-----------------------------------------------------------------------

		/* 変更保存の監視。指定階層のファイルの更新時にタスクを行う
		 ------------------------------------------------------------------------*/
		esteWatch: {
			options: {
				dirs: ['<%= path.root %>/<%= path.compile %>/'],
				livereload: {
					enabled: false
				}
			},
			coffee: function(filepath) {
				return ['coffee','jshint','concat:run','uglify'];
			},
			ts: function(filepath) {
				return ['typescript','jshint','concat:run','uglify'];
			},
			scss: function(filepath) {
				return ['compass','concat:style','csscomb','cssmin'];
			}
		},
		//-----------------------------------------------------------------------

		/* livereload
		 ------------------------------------------------------------------------*/
		livereloadx: {
			dir: '<%= path.root %>'
		},
		//-----------------------------------------------------------------------

		/* ページオープン
		 ------------------------------------------------------------------------*/
		// ページオープン用URL
		open: {
			dev: {
				path: 'http://<%= path.vh %>/'
			}
		},
		//-----------------------------------------------------------------------

		/* 初期ディレクトリ作成
		 ---------------------------------------------------*/
		mkdir: {
			prepare: {
				options: {
					create: [
						'<%= path.root %>',
						'<%= path.root %>/<%= path.src %>',
						'<%= path.root %>/<%= path.src %>/css',
						'<%= path.root %>/<%= path.src %>/img',
						'<%= path.root %>/<%= path.src %>/include',
						'<%= path.root %>/<%= path.src %>/js',
						'<%= path.root %>/<%= path.src %>/compile',
						'<%= path.root %>/<%= path.src %>/fonts',
						'<%= path.root %>/<%= path.src %>/icons'
					]
				}
			}
		},
		//-----------------------------------------------------------------------

		/* データ複製
		 ---------------------------------------------------*/
		copy: {
			setup: {
				files: [
					{ expand: true, cwd: 'lib', src: ['index.html'], dest: '<%= path.root %>' },
					{ expand: true, cwd: 'lib', src: ['normalize.css'], dest: '<%= path.root %>/<%= path.src %>/css' },
					{ expand: true, cwd: 'lib', src: ['modernizr.custom.js'], dest: '<%= path.root %>/<%= path.src %>/js' }
				]
			}
		},
		//-----------------------------------------------------------------------

		/* 不要初期ファイル削除
		 ---------------------------------------------------*/
		clean: {
			prepare: {
				options: {
					force: true // 強制的に上位ディレクトリを削除
				},
				src: [
					'assets',
					'<%= path.root %>/grunt_files/lib',
					'<%= path.root %>/grunt_files/cmd_bat/grunt_install.command'
				]
			}
		}
		//-----------------------------------------------------------------------
	});

	// gruntコマンドを打つと走るタスクです。
	grunt.registerTask('default', ['coffee','typescript','compass','concat','csscomb','uglify','cssmin','jshint']);
	// grunt startコマンドを打つと走るタスクです。初期構築を行います。
	grunt.registerTask('start', ['mkdir','copy','clean:prepare']);
	// grunt startコマンドを打つと走るタスクです。ファイルの監視・livereloadを行います。
	grunt.registerTask('watch_files', ['open','livereloadx','esteWatch']);
	// grunt imageコマンドを打つと走るタスクです。画像を圧縮します。
	grunt.registerTask('imagemin', ['imagemin']);
	// grunt webfontコマンドを打つと走るタスクです。webfontを作成します。
	grunt.registerTask('webfont', ['webfont']);

	// loadNpmTasksを変更（プラグイン読み込み）
	var taskName;
	for(taskName in pkg.devDependencies) {
		if(taskName.substring(0, 6) == 'grunt-') {
			grunt.loadNpmTasks(taskName);
		}
	}

	// loadNpmTasksを変更（手動）
	grunt.loadNpmTasks('livereloadx');
};