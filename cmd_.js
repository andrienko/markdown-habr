#! /usr/bin/env node

var marked = require('marked');
var fs = require('fs');

(function(){

  var arguments = process.argv.slice(2);

  if(arguments.length==0){
    console.log("\nNo arguments provided. Provide at least filename:\n> habrmd document.md");
  }
  else{

    var file = arguments[0];
    var file_contents = fs.readFileSync(file, "utf8");
    var parsed_markdown = marked(file_contents,{
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: false
    });

    console.log(parsed_markdown);

  }

})();
