var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var folderMount = function folderMount(connect, point) {
	return connect.static(path.resolve(point));
};

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
		root: '../',				// project root
		src: 'common',				// 共通リソースの配置先
		compile: 'common/compile'	// コンパイル言語ソース類の配置先
	};

	grunt.initConfig({

		/* パス設定のロード
		---------------------------------------------------*/
		path: pathConfig,

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
					'<%= path.root %><%= path.src %>/js/run.js': ['<%= path.root %><%= path.compile %>/*.coffee']
				}
			}
		},
		//-----------------------------------------------------------------------

		/* Scssのコンパイル
		------------------------------------------------------------------------*/
		compass: {
			dist: {
				options: {
					basePath: '<%= path.root %>',
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
					'<%= path.root %><%= path.src %>/css/normalize.css',
					'<%= path.root %><%= path.src %>/css/hogehoge.css',
					'<%= path.root %><%= path.src %>/css/hogehoge2.css'
				],
				dest: '<%= path.root %><%= path.src %>/all/style-all.css'
			},
			run: {
				src: [
					'<%= path.root %><%= path.src %>/js/modernizr.custom.js',
					'<%= path.root %><%= path.src %>/js/hogehoge.js',
					'<%= path.root %><%= path.src %>/js/hogehoge2.js'
				],
				dest: '<%= path.root %><%= path.src %>/all/run-all.js'
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
				src: ['<%= path.root %><%= path.src %>/all/run-all.js'],
				dest: '<%= path.root %><%= path.src %>/all/run-all.min.js'
			}
		},
		/* cssファイルの圧縮
		------------------------------------------------------------------------*/
		cssmin: {
			style: {
				src: ['<%= path.root %><%= path.src %>/all/style-all.css'],
				dest: '<%= path.root %><%= path.src %>/all/style-all.min.css'
			}
		},
		//-----------------------------------------------------------------------

		/* jsHintによるjsデバッグ。結果はコンソールに表示
		------------------------------------------------------------------------*/
		jshint: {
			// 対象ファイルを指定
			all: ["<%= path.root %><%= path.src %>/js/run.js"]
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

		/* 変更保存の監視。指定階層のcoffee,scss,htmlの更新時にタスクを行う
		------------------------------------------------------------------------*/
		watch:{
			options: {
				livereload: true,
				nospawn: true
			},
            html: {
				files: ['<%= path.root %>/*.html','<%= path.root %>/**/*.html','<%= path.root %>/**/**/*.html','<%= path.root %>/**/**/**/*.html'],
                tasks: []
            },
			coffee:{
				files:['<%= path.root %><%= path.compile %>/*.coffee'],
				tasks:['coffee','jshint','concat:run','uglify']
			},
			sass:{
				files:['<%= path.root %><%= path.compile %>/*.scss'],
				tasks:['compass','concat:style','cssmin']
			}
		},
		//-----------------------------------------------------------------------

		/* サーバー
        ------------------------------------------------------------------------*/
        // ブラウザ自動リロード用のサーバーを立てる設定
        connect: {
			server: {
                options: {
                    port: 9001,
                    middleware: function(connect, options) {
                        return [lrSnippet, folderMount(connect, '.')];
                    }
                }
            }
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
						'<%= path.root %><%= path.src %>',
                        '<%= path.root %><%= path.src %>/css',
                        '<%= path.root %><%= path.src %>/img',
                        '<%= path.root %><%= path.src %>/include',
                        '<%= path.root %><%= path.src %>/js',
                        '<%= path.root %><%= path.src %>/compile'
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
                    { expand: true, cwd: 'lib', src: ['normalize.css'], dest: '<%= path.root %><%= path.src %>/css' },
                    { expand: true, cwd: 'lib', src: ['modernizr.custom.js'], dest: '<%= path.root %><%= path.src %>/js' }
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
                    '<%= path.root %>/grunt_files/cmd_bat/grunt_install.bat'
                ]
            }
        }
        //-----------------------------------------------------------------------
	});

	// gruntコマンドを打つと走るタスクです。
	grunt.registerTask('default', ['coffee','compass','concat','csscomb','uglify','cssmin','jshint']);
	// grunt startコマンドを打つと走るタスクです。初期構築を行います。
	grunt.registerTask('start', ['mkdir','copy','clean:prepare']);
	// grunt startコマンドを打つと走るタスクです。ファイルの監視・livereloadを行います。
	grunt.registerTask('watch_files', ['open','connect','watch']);
	// grunt imageコマンドを打つと走るタスクです。画像を圧縮します。
	grunt.registerTask('imagemin', ['imagemin']);

	// loadNpmTasksを変更（プラグイン読み込み）
	var taskName;
	for(taskName in pkg.devDependencies) {
		if(taskName.substring(0, 6) == 'grunt-') {
			grunt.loadNpmTasks(taskName);
		}
	}
};