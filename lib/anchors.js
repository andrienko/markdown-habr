/*global module,require*/
var slug = require("slugify3");

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

module.exports = Anchors;
