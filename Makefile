sass:
	gulp sass
sassWatch:
	gulp watch
cssmin:
	gulp cssmin
jsmin:
	gulp jsmin
build:
	gulp sass
	gulp cssmin
	gulp jsmin
	gulp copyJS
	gulp copyCSS

