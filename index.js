var fs = require('fs');
var path = require('path');

var schemas = [];

function findSchemas(dir) {
  var p = path.resolve(__dirname, dir);
  fs.readdirSync(p).forEach(function(file) {

    if (file.match(/\.json$/)) {
      var schema = require(path.resolve(p, file));
      if (schema.id) {
        schemas.push(schema);
      }
    }
  });
}

['.', './protocol', './service', './state'].forEach(findSchemas);

module.exports = schemas;
