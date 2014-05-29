var ejs = require('ejs');
var fs = require('fs');
var _s = require('underscore.string');

function load(f) {
  return fs.readFileSync(f, 'utf8');
}

var tpl = ejs.compile(load('./services/javascript.js'));

var schemas = require('../index');

schemas.forEach(function(schema) {
  if (schema.id.match(/(service|protocol)/)) {
    var className = _s.capitalize(_s.camelize(schema.id.substring(schema.id.lastIndexOf('/') + 1).replace(/\./g, '-')));

    var out = tpl({
      service: schema,
      className: className
    });
    fs.writeFileSync('../gen/' + className + '.js', out);
  }
});
