var fs = require('fs');
var colors = require('colors');
var tv4 = require('tv4');
var formats = require('tv4-formats');
var schemas = require('../');
var path = require('path');
var util = require('util');

var pass = true;

tv4.addFormat(formats);

schemas.forEach(tv4.addSchema.bind(tv4));

var base = tv4.getSchema('http://json-schema.org/draft-04/schema#');

console.log('Validating Schemas'.blueBG.white.underline);
schemas.forEach(function(schema) {

  schema.$schema = tv4.resolveUrl(schema.id, schema.$schema);

  var parent = tv4.getSchema(schema.$schema);

  if (!parent) {
    console.log('Couldn\'t find parent schema "%s" from schemas "%s"'.red, schema.$schema, schema.id);
    pass = false;
    return;
  }

  var error;

  var result = tv4.validateResult(schema, parent, true, true);
  if (!result.valid) {
    error = util.format('Error: %s at %s', result.error.message.red, result.error.dataPath.yellow);

    if (result.missing.length) {
      console.log('Missing Schema!'.red, result.missing.join(','));
    }

  } else if (parent.id == 'http://schema.ninjablocks.com/service' || parent.id == 'http://schema.ninjablocks.com/protocol'){

    if (schema.methods) {
      Object.keys(schema.methods).forEach(function(method) {
        (schema.methods[method].params||[]).forEach(function(param, i) {

          try {
            var paramSchema = resolveSchema(param);

            var result = tv4.validateResult(paramSchema, base, true, true);
            if (!result.valid) {
              error = util.format('Error in method: %s param: %s - %s at %s', method.yellow, (i+'').yellow, result.error.message.red, result.error.dataPath.yellow);
            }

          } catch(e) {
            error = util.format('Error in method: %s param: %s - %s', method.yellow, (i+'').yellow, (e.message || e).red);
          }

        });
      });
    }

    if (schema.events) {
      Object.keys(schema.events).forEach(function(event) {
        var payload = schema.events[event];

        try {
          var payloadSchema = resolveSchema(payload);

          var result = tv4.validateResult(payloadSchema, base, true, true);
          if (!result.valid) {
            error = util.format('Error in %s event payload: %s at %s', event.yellow, result.error.message.red, result.error.dataPath.yellow);
          }

        } catch(e) {
          error = util.format('Error in %s event payload: %s', event.yellow, (e.message || e).red);
        }

      });

    }

  }

  if (error) {
    pass = false;
  }


  console.log('  ' + schema.id.yellow, (!error?'Valid'.green : 'Invalid'.red));
  if (error) {
    console.log('   ' + error);
    console.log(' ');
  }

});

console.log('');
console.log('Testing Schemas'.blueBG.white.underline);


var stateTestPath = path.resolve(__dirname, 'validation-tests');
fs.readdirSync(stateTestPath).forEach(function(file) {
  var testFile = require(stateTestPath + '/' + file);

  var results = [];
  function runTests(tests, expected) {
    tests.forEach(function(test) {
      var result = tv4.validateResult(test, tv4.getSchema(testFile.schema), true, true);
      var x = result.valid?'Pass':'Fail';
      if (result.valid === expected) {
        results.push(x.green);
      } else {
        pass = false;
        console.log(result);
        results.push(x.red);
      }
    });
  }

  runTests(testFile.valid, true);
  runTests(testFile.invalid, false);
  console.log('  ' + testFile.schema.yellow + ' - ' + results.join(' '));
});

console.log('');
if (pass) {
  console.log('- Tests passed'.green);
  process.exit(0);
} else {
  console.log('- Tests failed'.red);
  process.exit(1);
}



function resolveSchema(schemaUri, baseUri, urlHistory) {

  var schema = schemaUri;

  if (typeof schema === 'string') {
    schema = getSchema(schema, baseUri);
    if (!schema) {
      throw new Error('Failed to resolve schema uri ' + schemaUri);
    }
  }

  if (!schema) {
    throw new Error('Failed to resolve schema refs ' + Object.keys(urlHistory).join(', '));
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
