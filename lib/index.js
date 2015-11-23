/*jslint regexp: true*/
/*global require,module,console*/
/*eslint camelcase: 0, quotes: 0, no-trailing-spaces: 0, no-unused-vars: 0, no-console: 0*/


var marked = require("marked"),
  extend = require("extend"),
  slug = require("slugify3");

module.exports = (function () {
  "use strict";
  var version = '0.0.5';

  var Specials = function () {};

  Specials.prototype = {
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

  var Replaces = function () {};

  Replaces.prototype = {

    registry: {},

    define: function (name, regex, replacement, before) {
      before = before || false;
      this.registry[name] = {
        regex: regex,
        replacement: replacement,
        before: before
      };
    },

    run: function (string, before) {
      var name, data, condition;
      for (name in this.registry) {
        if (this.registry.hasOwnProperty(name) && this.registry[name].before === before) {
          data = this.registry[name];
          string = this.replace_single(string, data);
        }
      }
      return string;
    },

    replace_single: function (string, data) {
      return string.replace(data.regex, data.replacement);
    }

  };

  var Anchors = function () {
    this.slugs = [];
  };
  Anchors.prototype = {
    get_unique_slug: function (slug_string) {
      if (this.slugs.indexOf(slug_string) !== -1) {
        var matches = slug_string.match(/(\S*-)(\d*)/);
        if (matches !== null) {
          var num = parseInt(matches[2], 10) || 0;
          return this.get_unique_slug(matches[1] + (num + 1));
        } else {
          return this.get_unique_slug(slug_string + '-1');
        }
      }
      this.slugs.push(slug_string);
      return slug_string;
    },
    get: function (string, anchor_slugs) {
      anchor_slugs = anchor_slugs || true;
      return this.get_unique_slug(anchor_slugs ? slug(string).toLowerCase() : 'h-1');
    }
  };


  var default_options = {
      add_anchors: true,
      add_anchor_links: true,
      anchor_slugs: true,
      pedantic: false,
      gfm: true,
      enable_specials: true,
      sanitize: false,
      punctuation: true,
      remove_yo: false,
      use_paragraph_tags: false
    },

    Lib = function (options) {
      this.options = extend(default_options, options);

      this.specials = new Specials();
      this.replaces = new Replaces();
      this.anchors = new Anchors();

      this.default_replaces(this.replaces);
      this.default_specials(this.specials);

      this.renderer = this.get_renderer(this);
      this.version = version;
    };

  Lib.prototype = {

    default_specials: function () {
      this.specials.define('habracut', /\s*-{2,}\s{0,1}x\s{0,1}-{2,}(.*)/g, function (title) {
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
    },

    default_replaces: function () {
      if (this.options.punctuation) {
        this.replaces.define('russian_quotes', /“([а-яё]+(.*?)[а-яё!?.]+)”/ig, '«$1»', false);
      }
      if (this.options.remove_yo) {
        this.replaces.define('yo_capital', /Ё/g, 'Е', false);
        this.replaces.define('yo_small', /ё/g, 'е', false);
      }
    },

    parse: function (contents) {
      contents = this.replaces.run(contents, true);
      if (this.options.enable_specials) {
        contents = this.specials.preserve(contents);
      }

      var parsed_markdown = this.do_marked(contents, this.options);

      if (this.options.enable_specials) {
        parsed_markdown = this.specials.parse(parsed_markdown);
      }

      parsed_markdown = this.replaces.run(parsed_markdown, false);

      return (parsed_markdown);
    },

    do_marked: function (contents, options) {
      return marked(contents, {
        gfm: options.gfm,
        tables: true,
        breaks: false,
        pedantic: options.pedantic,
        sanitize: options.sanitize,
        smartLists: true,
        smartypants: options.punctuation,
        renderer: this.renderer
      });
    },

    get_renderer: function (instance) {

      var renderer = new marked.Renderer();
      var options = instance.options;
      var anchors = instance.anchors;

      renderer = extend(renderer, {
        heading: function (text, level) {

          var heading_text = text,
            anchor_link = anchors.get(text);

          heading_text = '<h' + level + '>' + heading_text + '</h' + level + '>';


          if (options.add_anchors && options.add_anchor_links) {
            heading_text = '<a href="#' + anchor_link + '">' + heading_text + '</a>';
          }

          heading_text = "\n" + heading_text;

          if (options.add_anchors) {
            heading_text = '<anchor>' + anchor_link + '</anchor>' + heading_text;
          }

          return heading_text;
        },
        paragraph: function (text) {
          var text_without_breaks = text.replace(/\n/g, ' ').replace(/ {2,}/, ' ');
          if (options.use_paragraph_tags) {
            return '<p>' + text_without_breaks + "</p>\n";
          }
          return "\n" + text_without_breaks + "\n";
        },
        code: function (code, language) {
          var code_text = '';
          code_text += "\n\n";
          code_text += language === undefined ? '<source>' : '<source lang="' + language + '">';
          code_text += code;
          code_text += '</source>';
          return code_text;
        },
        list: function (content, ordered) {
          var list_text = '';
          list_text += "\n";
          list_text += ordered ? '<ol>' : '<ul>';
          list_text += content + "\n";
          list_text += ordered ? '</ol>' : '</ul>';
          return list_text;
        },
        listitem: function (content) {
          return "\n<li>" + content.trim() + '</li>';
        },
        blockquote: function (content) {
          return '<blockquote>' + content.trim() + '</blockquote>';
        }
      });

      return renderer;
    }
  };

  return Lib;

}());
