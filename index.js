var helpers = require("postcss-message-helpers");
var colorblind = require('color-blind');
var colorNames = require('css-color-names');
var postcss = require('postcss');
var hexRegEx = /^#(?:[0-9a-f]{3}){1,2}$/i;


var convertToken = function(tokenInput, method) {
  var token = tokenInput.toLowerCase();
  if (token.match(hexRegEx)) {
    return colorblind[method](token)
  }
  else if (colorNames[token]) {
    return colorblind[method](colorNames[token]);
  }
  // else if rgb
  // else if rgba
  else {
    return token;
  }
};

module.exports = postcss.plugin('colorblind', function (opts) {
  opts = opts || {};
  method = opts.method ? opts.method.toLowerCase().trim() : 'deuteranopia';
  if (typeof colorblind[method] !== 'function') {
    throw new Error('postcss-colorblind was given an invalid color transform: ' + method);
  }
  return function(style) {
    style.eachDecl(function transformDecl(decl) {
      helpers.try(function() {
        var stringArray = decl.value.toLowerCase().split(' ');
        var changed = stringArray.map(function(token) {
          return convertToken(token, method);
        });
        decl.value = changed.join(' ');
      }, decl.source);
    });
  };
});
