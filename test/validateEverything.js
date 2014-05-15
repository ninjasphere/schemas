var fs = require('fs');
var colors = require('colors');
var tv4 = require('tv4');

// Map all the schemas to urls

var walker = require('walkdir')('../');

walker.on('file', function(file, stat) {
  if (file.indexOf('testing') < 0 && file.match(/\.json$/)) {
    tv4.addSchema(require(file));
  }
});

walker.on('end', function() {
  var schemas = tv4.getSchemaMap();
  console.log('');
  console.log('Validating Schemas'.blueBG.white.underline);
  Object.keys(schemas).forEach(function(name) {
    var result = tv4.validateMultiple(schemas[name], schemas[schemas[name].$schema]);
    console.log('  ' + name.yellow, '-', result.valid?'Valid'.green : 'Invalid'.red);
    if (!result.valid) {
      console.log('    Errors', result.errors);
      console.log('    Missing', result.missing);
    }
  });
});

walker.on('end', function() {
  console.log('');
  console.log('Testing Schemas'.blueBG.white.underline);

  var schemas = tv4.getSchemaMap();

  var walker = require('walkdir')('./state-tests');
  walker.on('file', function(file, stat) {
    var testFile = require(file);

    var results = [];
    function runTests(tests, expected) {
      tests.forEach(function(test) {
        var result = tv4.validateMultiple(test, schemas[testFile.schema]);
        if (result.valid === expected) {
          results.push('Pass'.green);
        } else {
          results.push('Fail'.red);
        }
      });
    }

    runTests(testFile.valid, true);
    runTests(testFile.invalid, false);
    console.log('  ' + testFile.schema.yellow + ' - ' + results.join(' '));

  });
});
