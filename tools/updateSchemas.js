var fs = require('fs');

var schemas = require('../');

schemas.forEach(function(schema) {

  var file = schema._file;
  delete(schema._file);


  if (schema.methods) {
    Object.keys(schema.methods).forEach(function(methodName) {
      var method = schema.methods[methodName];

      if (!method.returns.value) {
        var value = method.returns;
        method.returns = {
          value: value
        };

        if (value.description) {
          method.returns.description = value.description;
          delete(value).description;
        }

      }
    });


  }

  if (schema.events) {
    Object.keys(schema.events).forEach(function(eventName) {
      var event = schema.events[eventName];

      if (!event.value) {
        var value = event;
        schema.events[eventName] = {
          value: value
        };

        if (value.description) {
          schema.events[eventName].description = value.description;
          delete(value).description;
        }

      }

    });

  }

  var regex = /{\s+("\$ref": "(?:[^"]+)")\s+}/g;
  
  fs.writeFileSync(file, JSON.stringify(schema, 2, 2).replace(regex, '{ $1 }'), 'utf8');

});
