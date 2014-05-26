var fs = require('fs');
var path = require('path');

var schemas = [];

function findSchemas(dir) {
  var p = path.resolve(__dirname, dir);
  fs.readdirSync(p).forEach(function(file) {
    var filePath = path.resolve(p, file);

    if (fs.statSync(filePath).isDirectory() && dir !== '.' && file[0] !== '.') {
      findSchemas(filePath);
    } else {

      if (file.match(/\.json$/)) {
        var schema = require(filePath);
        if (schema.id) {
          schemas.push(schema);
        }
      }
    }
  });
}

['.', './protocol', './service', './state'].forEach(findSchemas);

module.exports = schemas;
