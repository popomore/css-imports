'use strict';

module.exports = imports;

function imports(str, fn) {
  if (str instanceof Buffer) str = str.toString();
  if (fn) return map(str, fn);
  var re = /@import *(?:url\(['"]?([^'"]+)['"]?\)|['"]([^'"]+)['"]);?/g;
  var ret = [];
  var m;

  str = removeComment(str);
  while (m = re.exec(str)) {
    ret.push({
      string: m[0],
      path: m[1] || m[2],
      index: m.index
    });
  }

  return ret;
}

function map(str, fn) {
  imports(str).forEach(function(r){
    str = str.replace(r.string, fn(r));
  });

  return str;
}

function removeComment(str) {
  return str.replace(/\/\*[\S\s]*?\*\//g, '');
}
