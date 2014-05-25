var fs = require('fs');
var colors = require('colors');
var tv4 = require('tv4');
var formats = require('tv4-formats');
var schemas = require('../');
var path = require('path');

var pass = true;

tv4.addFormat(formats);

schemas.forEach(tv4.addSchema.bind(tv4));

console.log('Validating Schemas'.blueBG.white.underline);
schemas.forEach(function(schema) {

  schema.$schema = tv4.resolveUrl(schema.id, schema.$schema);

  var parent = tv4.getSchema(schema.$schema);

  if (!parent) {
    console.log('Couldn\'t find parent schema "%s" from schemas "%s"'.red, schema.$schema, schema.id);
    pass = false;
    return;
  }

  var result = tv4.validateResult(schema, parent, true, true);
  console.log('  ' + schema.id.yellow, '-', result.valid?'Valid'.green : 'Invalid'.red);
  if (!result.valid) {
    pass = false;
    console.log('    Error: %s at %s', result.error.message.red, result.error.dataPath.yellow);
    if (result.missing.length) console.log('    Missing', result.missing.join(','));

    console.log('');
  }
});

console.log('');
console.log('Testing Schemas'.blueBG.white.underline);


var stateTestPath = path.resolve(__dirname, 'state-tests');
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
