var ejs = require('ejs');
var fs = require('fs');
var _s = require('underscore.string');


var tv4 = require('tv4');
var schemas = require('../');

schemas.forEach(tv4.addSchema.bind(tv4));

function load(f) {
  return fs.readFileSync(f, 'utf8');
}

var tpl = ejs.compile(load('./services/javascript.js'));

schemas.forEach(function(schema) {
  if (schema.id.match(/(service|protocol)/)) {
    var className = _s.capitalize(_s.camelize(schema.id.substring(schema.id.lastIndexOf('/') + 1).replace(/\./g, '-')));

    if (schema.methods) {
      Object.keys(schema.methods).forEach(function(methodName) {
        var method = schema.methods[methodName];
        (method.params || []).forEach(function(param) {
          param.value = resolveSchema(param.value, schema.id);
        });

        method.returns = resolveSchema(method.returns, schema.id);
      });
    }

    if (schema.events) {
      Object.keys(schema.events).forEach(function(eventName) {
        var event = schema.events[eventName];

        event.value = resolveSchema(event.value, schema.id);
      });
    }

    var out = tpl({
      service: schema,
      className: className
    });
    fs.writeFileSync('../gen/' + className + '.js', out);
  }
});



function resolveSchema(schemaUri, baseUri, urlHistory) {

  var schema = schemaUri;

  if (typeof schema === 'string') {
    schema = getSchema(schema, baseUri);
    if (!schema) {
      throw new Error('Failed to resolve schema uri ' + schemaUri);
    }
  }

  if (!schema) {
    throw new Error('Failed to resolve schema ref ' + schemaUri + ' [history: ' + Object.keys(urlHistory).join(', ') + ']');
  }

  if (schema.$ref !== undefined) {
    urlHistory = urlHistory || {};
    if (urlHistory[schema.$ref]) {
      throw new Error('Circular reference in schema refs. ' + Object.keys(urlHistory).join(', '));
    }
    urlHistory[schema.$ref] = true;
    schema = resolveSchema(schema.$ref, baseUri, urlHistory);

  }
  return schema;
}

function getSchema(uri, baseUri) {

  baseUri = baseUri || 'http://schema.ninjablocks.com/';
  var resolvedUri = tv4.resolveUrl(baseUri, uri);
  //console.log('Resolved schema uri', uri, 'with base', baseUri, 'to', resolvedUri);
  return tv4.getSchema(resolvedUri);
}
