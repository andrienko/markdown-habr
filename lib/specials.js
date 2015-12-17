/*global module,require*/

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

module.exports = Specials;
