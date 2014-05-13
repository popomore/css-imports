'use strict';

require('should');
var fs = require('fs');
var less = require('less');
var imports = require('..');

describe('css-imports', function() {

  it('return all @import', function() {
    var code = fs.readFileSync(__dirname + '/fixtures/normal.css');
    var ret = imports(code);
    ret.should.eql([
      {
        string: '@import url(\'./b.css\');',
        path: './b.css',
        index: 0
      },
      {
        string: '@import url("c");',
        path: 'c',
        index: 51
      },
      {
        string: '@import "d"',
        path: 'd',
        index: 69
      },
      {
        string: '@import  \'e\';',
        path: 'e',
        index: 81
      },
      {
        string: '@import  url(f);',
        path: 'f',
        index: 95
      }
    ]);
  });

  it('replace @import', function() {
    var code = fs.readFileSync(__dirname + '/fixtures/normal.css');
    var ret = imports(code, normalize);

    ret.should.include('@import url("./b.css");');
    ret.should.include('@import url("c");');

    function normalize(item) {
      return '@import url("' + item.path + '");';
    }
  });

  it('less example', function(done) {
    var code = fs.readFileSync(__dirname + '/fixtures/normal.less').toString();

    parseLess(code, function(err, ret) {
      if (err) return done(err);

      imports(ret).should.eql([{
        string: '@import url("bar.css");',
        path: 'bar.css',
        index: 0
      }, {
        string: '@import "base";',
        path: 'base',
        index: 24
      }]);
      done();
    });
  });
});

function parseLess (code, cb) {
  var parser = new(less.Parser)({
    paths: [__dirname + '/fixtures']
  });
  parser.parse(code, function (err, tree) {
    cb(err, tree.toCSS());
  });
}
