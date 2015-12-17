#!/usr/bin/env node

/*jslint nomen: true*/
/*eslint camelcase: 0, quotes: 0, no-trailing-spaces: 0, no-unused-vars: 0,no-console:0,
no-process-exit: 0*/
/*global require,console,process*/

var fs = require('fs'),
  Markdown_habr = require('../lib'),
  minimist = require('minimist');

(function () {
  'use strict';

  var args,
    file_name_source,
    file_name_destination,
    file_contents,
    parser_options,
    parsed;

  args = minimist(process.argv.slice(2), {
    alias: {
      f: 'source',
      d: 'destination',
      z: 'sanitize',
      h: 'help',
      a: 'no-anchors',
      l: 'no-links',
      u: 'no-slugs',
      g: 'no-gfm',
      p: 'pedantic',
      t: 'no-smart-punctuation',
      r: 'use-p',
      v: 'version',
      o: 'remove-yo'
    }
  });


  if (args.source !== undefined) {
    file_name_source = args.source;
  } else if (args._[0] !== undefined) {
    file_name_source = args._[0];
  }

  if (args.destination !== undefined) {
    file_name_destination = args.destination;
  } else if (args._[1] !== undefined) {
    file_name_destination = args._[1];
  }

  if (args.version !== undefined) {
    console.log(new Markdown_habr().version);
    process.exit(0);
  }

  if (args.help !== undefined || args._[0] === '?' || args['?'] !== undefined) {

    console.log("mdhabr is a tool to compile markdown files to habrahabr-ready markup\n\n");
    console.log("Example:\nmdhabr example.md example.html");
    console.log('If the destination is not specified the result will be outputted to stdout.');

    console.log('-z, --sanitize               strip HTML tags from source');
    console.log('-a, --no-anchors             disable anchors creation');
    console.log('-l, --no-links               disable anchor link generation around Header tags ');
    console.log('-u, --no-slugs               instead of using slugs generated from header text, for anchor links use h-[number] format');
    console.log('-g, --no-gfm                 disable github-flavored markdown');
    console.log('-p, --pedantic               conform to obscure parts of markdown.pl');
    console.log('-z, --sanitize               strip HTML tags from input');
    console.log('-t, --no-smart-punctuation   disable smart typograhic punctuation for things like quotes and dashes');
    console.log('-o, --remove-yo              replace "ё" with "е"');
    console.log('-v, --version                show the version of the library currently used')

    process.exit(0);
  }

  if (file_name_source === undefined && args.text === undefined) {
    console.log("\nSpecify the filename. Use mdhabr -h for help");
    process.exit(1);
  }

  if (!fs.existsSync(file_name_source) && args.text === undefined) {
    console.log('ERROR: path "' + file_name_source + '" does not exist :(');
    process.exit(1);
  }

  if (args.text !== undefined) {
    file_contents = args.text;
  } else {
    file_contents = fs.readFileSync(file_name_source, 'utf8');
  }

  parser_options = {
    add_anchors: args['no-anchors'] === undefined,
    add_anchor_links: args['no-links'] === undefined,
    anchor_slugs: args['no-slugs'] === undefined,
    pedantic: args.pedantic !== undefined,
    gfm: args['no-gfm'] === undefined,
    sanitize: args.sanitize !== undefined,
    punctuation: args['no-smart-punctuation'] === undefined,
    use_paragraph_tags: args['use-p'] !== undefined,
    remove_yo: args['remove-yo'] !== undefined
  };

  var parser = new Markdown_habr(parser_options);
  parsed = parser.parse(file_contents);

  if (file_name_destination !== undefined) {
    fs.writeFileSync(file_name_destination, parsed, 'utf-8');
  } else {
    console.log(parsed);
  }

  process.exit(0);

}());
