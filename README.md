# markdown-habr

Habrahabr is a russian social network / collective blog dedicated to IT and Computer Science. For its articles the social network is using a markup which has some HTML tags (with limited functionality) as well as some tags introduced by the site.  

Markdown-habr is a simple tool to compile markdown to habrahabr HTML.

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
    };
    
    var result = mdhabr.parse("# Hello, I am a title \nAnd I am some text', options);
    
## Disclaimer

I am making the tool for myself mostly. Don't be surprised by its illogics.