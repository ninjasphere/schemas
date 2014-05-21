var fs = require('fs');
var colors = require('colors');
var tv4 = require('tv4');
var schemas = require('../');
var path = require('path');

var pass = true;

schemas.forEach(tv4.addSchema.bind(tv4));

var schemaMap = tv4.getSchemaMap();

console.log('Validating Schemas'.blueBG.white.underline);
schemas.forEach(function(schema) {
  var result = tv4.validateResult(schema, schemaMap[schema.$schema], true, true);
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
      var result = tv4.validateResult(test, schemaMap[testFile.schema]);
      if (result.valid === expected) {
        results.push('Pass'.green);
      } else {
        pass = false;
        console.log(result);
        results.push('Fail'.red);
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
