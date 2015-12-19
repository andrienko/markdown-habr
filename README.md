# markdown-habr

[Package in npm](http://npmjs.com/package/markdown-habr) | [Github repo](https://github.com/andrienko/markdown-habr)

Habrahabr is a russian social network / collective blog dedicated to IT and Computer Science. For its articles the social network is using a markup which has some HTML tags (with limited functionality) as well as some tags introduced by the site.  

Markdown-habr is a simple tool to compile markdown to habrahabr HTML. It is represented by the library and the commandline tool to parse MD files.

Also [Github-flavored markdown](https://help.github.com/articles/github-flavored-markdown/) is supported.

## Usage as command line tool

In order to use it you have to have node.js and npm installed and all required variables added to your PATH system variable.

    npm install -g markdown-habr
    mdhabr example.md example.html
    
There are command-line parameters that affect some options of the parser.

 - `-z`, `--sanitize`               strip HTML tags from source
 - `-a`, `--no-anchors`             disable anchors creation
 - `-l`, `--no-links`               disable anchor link generation around Header tags 
 - `-u`, `--no-slugs`               instead of using slugs generated from header text, for anchor links use 'h-[number]' format
 - `-g`, `--no-gfm`                 disable github-flavored markdown
 - `-p`, `--pedantic`               conform to obscure parts of markdown.pl
 - `-z`, `--sanitize`               strip HTML tags from input
 - `-t`, `--no-smart-punctuation`   disable smart typograhic punctuation for things like quotes and dashes
 - `-r`, `--use-p`                  add paragraph tags to paragraphs (habrahabr does not use them)
 - `-o`, `--remove-yo`              replace "ё" letter with "е"
 - `-v`, `--version`                current library version
 - `-h`, `--help`                   this information
 - `-d`, `--destination`            path to write result
 - `-f`, `--source`                 file to compile

## Usage as library

The library utilizes [marked](https://www.npmjs.com/package/marked) markdown parser library with custom renderer.

    var mdhabr = new require('markdown-habr')();
    var result = mdhabr.parse("# Hello, I am a title \nAnd I am some text');
    
There are also options available. You can specify some or all of them to override defaults:

    var mdhabr = require('markdown-habr');
    
    var options = {
      // Add <anchor> tag before each heading with a slug
      add_anchors:      true,
      // Add <a href="#slug"> link to each heading. Only when add_anchors is enabled
      add_anchor_links: true,
      // Use title of article to generate a slug. Otherwise slugs will be h-1, h-2 etc.
      anchor_slugs:     true,
      // Pedantic feature of marked library. "Conform to obscure parts of markdown.pl"
      pedantic:         false,
      // "smart typograhic punctuation for things like quotes and dashes." of marked
      punctuation:      true,
      // Use github-flavored markdown
      gfm:              true,
      // Uses marked sanitize option to clean HTML tags from input
      sanitize:         false,
      // Replace Ё letter with Е
      remove_yo:        false,
      // Enable special tags (like habracut)
      enable_specials:  true
    };
    
    var result = mdhabr.parse("# Hello, I am a title \nAnd I am some text', options);
    
## New syntax

### Media links

Links to twitter, slideshare or youtube,rutube and vimeo videos, wrapped with square braces, will be turned into `<twitter>`, `<slideshow>` and `<video>` tags:

    [https://twitter.com/GreatDismal/status/677760641105457153]
    <twitter>https://twitter.com/GreatDismal/status/677760641105457153</twitter>
    
    [http://www.slideshare.net/KyleDrake/bitcoin-the-cyberpunk-cryptocurrency]
    <slideshow>http://www.slideshare.net/KyleDrake/bitcoin-the-cyberpunk-cryptocurrency</slideshow?
    
    [https://www.youtube.com/watch?v=I3obFcCw8mk]
    <video>https://www.youtube.com/watch?v=I3obFcCw8mk</video>
    
Note that the link url has to match my regex, which is pretty dumb.
    
### Habracut

To make a `<cut>` tag, use this:

    --x--
    
You also can use text or use more than two dashes and add spaces:

    -- x ------------- Читать дальше
    
This should produce the `<cut>` tag:

    <cut>
    <cut text="Read More">

### Code highlighting

Currently `<source lang=" ... "></source>` (with lang attribute) blocks are produced only when using github-flavored markdown fenced code blocks:

    ```JavaScript
    console.log('Hello, world');
    ```
As for 19 Dec 2015 Habrahabr supports following highlighting models: Bash, C#, C++, CSS, Diff, HTML, XML, Ini, Java, JavaScript, PHP, Perl, Python, Ruby, SQL, 1C, AVR Assembler, ActionScript, Apache, Axapta, CMake, CoffeeScript, DOS, .bat, Delphi, Django, Erlang, Erlang REPL, Go, Haskell, Lisp, Lua, MEL, Markdown, Matlab, Nginx, Objective C, Parser3, Python profile, RenderMan, Rust, Scala, Smalltalk, TeX, VBScript, VHDL, Vala
    
## Disclaimer

I am making the tool for myself mostly. Don't be surprised by its illogics.