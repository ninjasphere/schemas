'use strict';

var fs = require('fs');
var path = require('path');

var schemas = [];

function findSchemas(dir) {
  var p = path.resolve(__dirname, '..', dir);
  fs.readdirSync(p).forEach(function(file) {
    var filePath = path.resolve(p, file);

    if (fs.statSync(filePath).isDirectory() && dir !== '.' && file[0] !== '.') {
      findSchemas(filePath);
    } else {

      if (file.match(/\.json$/)) {
        try {

          var schema = require(filePath);

          if (schema.id) {
            schemas.push(schema);
          }
        } catch (e) {
          throw new Error('Failed to parse schema ' + e.message.red + ' ' + e);
        }
      }
    }
  });
}

['.', './protocol', './service', './state', './model'].forEach(findSchemas);

module.exports = schemas;
