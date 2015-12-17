/*global module,require*/

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

module.exports = Replaces;
