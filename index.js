/*jslint regexp: true*/
/*global require,module,console*/

var marked = require('marked'),
  extend = require('extend'),
  slug = require('slug');

module.exports = (function () {
  'use strict';

  var default_options = {
      add_anchors: true,
      add_anchor_links: true,
      anchor_slugs: true,
      pedantic: false,
      gfm: true,
      enable_specials: true,
      sanitize: false,
      punctuation: true,
      use_paragraph_tags: false
    },
    options = {},
    anchor = {

      slugs: [],
      get_unique_slug: function (slug_string) {

        if (this.slugs.indexOf(slug_string) !== -1) {
          var matches = slug_string.match(/(\S*-)(\d*)/);
          if (matches !== null) {

            return this.get_unique_slug(matches[1] + (parseInt(matches[2], 10) + 1));
          } else {
            return this.get_unique_slug(slug_string + '-1');
          }
        }

        this.slugs.push(slug_string);
        return slug_string;
      },
      get: function (string) {
        if (!options.anchor_slugs) {
          string = 'h-1';
        }
        return this.get_unique_slug(slug(string).toLowerCase());
      }
    },

    lib = {
      parse: function (contents, new_options) {
        options = extend(default_options, new_options);

        if (options.enable_specials) {
          contents = this.specials.preserve(contents);
        }

        var parsed_markdown = marked(contents, {
          gfm: options.gfm,
          tables: true,
          breaks: false,
          pedantic: options.pedantic,
          sanitize: options.sanitize,
          smartLists: true,
          smartypants: options.punctuation,
          renderer: this.get_renderer()
        });

        if (options.enable_specials) {
          parsed_markdown = this.specials.parse(parsed_markdown);
        }

        return (parsed_markdown);
      },

      get_renderer: function () {

        var renderer = new marked.Renderer();

        renderer.heading = function (text, level) {

          var heading_text = text,
            anchor_link = anchor.get(text);

          heading_text = '<h' + level + '>' + heading_text + '</h' + level + '>';


          if (options.add_anchors && options.add_anchor_links) {
            heading_text = '<a href="#' + anchor_link + '">' + heading_text + '</a>';
          }

          heading_text = "\n" + heading_text;

          if (options.add_anchors) {
            heading_text = '<anchor>' + anchor_link + '</anchor>' + heading_text;
          }

          return heading_text;
        };

        renderer.paragraph = function (text) {
          var text_without_breaks = text.replace(/\n/g, ' ').replace(/ {2,}/, ' ');
          if (options.use_paragraph_tags) {
            return '<p>' + text_without_breaks + "</p>\n";
          }
          return "\n" + text_without_breaks + "\n";
        };

        renderer.code = function (code, language) {
          var code_text = '';
          code_text += "\n\n";
          code_text += language === undefined ? '<source>' : '<source lang="' + language + '">';
          code_text += code;
          code_text += '</source>';
          return code_text;
        };

        renderer.list = function (content, ordered) {
          var list_text = '';
          list_text += "\n";
          list_text += ordered ? '<ol>' : '<ul>';
          list_text += content + "\n";
          list_text += ordered ? '</ol>' : '</ul>';
          return list_text;
        };

        renderer.listitem = function (content) {
          return "\n<li>" + content.trim() + '</li>';
        };

        renderer.blockquote = function (content) {
          return '<blockquote>' + content.trim() + '</blockquote>';
        };

        return renderer;
      }
    };


  lib.specials = {
    registry: {},
    preserve: function (body) {
      var name;
      for (name in this.registry) {
        if (this.registry.hasOwnProperty(name)) {
          body = this.preserveSingle(body, name, this.registry[name]);
        }
      }
      return body;
    },
    preserveSingle: function (body, name, data) {
      return body.replace(data.regex, function (a, b, c) {
        var args = [name].concat([].slice.call(arguments).slice(1, -2));
        return '90vn0c0d3' + encodeURIComponent(JSON.stringify(args)) + '3nd90vn0c0d3nd';
      });
    },
    parse: function (body) {
      var registry = this.registry;
      body = body.replace(/90vn0c0d3(.*?)3nd90vn0c0d3nd/g, function (a, data) {
        data = JSON.parse(decodeURIComponent(data));
        return registry[data[0]].replacement.apply(this, data.slice(1));
      });
      return body;
    },
    define: function (name, regex, replacement) {
      this.registry[name] = {
        regex: regex,
        replacement: replacement
      };
    }
  };

  lib.specials.define('habracut', /\s*-{2,}\s{0,1}x\s{0,1}-{2,}(.*)/g, function (title) {
    title = title.trim();
    var habracut_text = "\n";
    if (title === '') {
      habracut_text += '<cut>';
    } else {
      habracut_text += '<cut text="' + title + '">';
    }
    habracut_text += "\n";
    return habracut_text;
  });

  return lib;

}());
