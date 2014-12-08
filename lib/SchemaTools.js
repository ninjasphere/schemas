'use strict';

require('colors');

var util = require('util');
var _ = require('underscore');
var schemas = require('./Schemas');
var tv4 = require('tv4');
var formats = require('tv4-formats');
var flatten = require('flat').flatten;

tv4.addFormat(formats);
schemas.forEach(tv4.addSchema.bind(tv4));

var log;
if (global.Ninja && Ninja.getLog) {
  log = Ninja.getLog('SchemaValidator');
} else {
  // XXX: Add server logging framework (debug?)
  log = {};
  [['trace', 'cyan'], ['debug', 'white'], ['info', 'blue'], ['warn', 'yellow'], ['error', 'red']].forEach(function(level) {
    log[level[0]] = console.log.bind(console, 'Schemas', level[0][level[1]] + '>');
  });
}

/*
 * On two occasions I have been asked,
 * – "Pray, Mr. Babbage, if you put into the machine wrong figures, will the right answers come out?"
 *
 * I am not able rightly to apprehend the kind of confusion of ideas that could provoke such a question.
 *
 * - Charles Babbage, Passages from the Life of a Philosopher (1864), ch. 5: "Difference Engine No. 1"
 */
function Schemas() {

}

/**
 * Returns a schema with fully resolved refs.
 * @param schema {string|object} The URI of the schema to get, or the schema itself
 * @param [baseUri] {string} The base URI to resolve from, defaults to the NB schema domain
 */
Schemas.prototype.getSchema = function(schema, baseUri, urlHistory) {

  if (typeof schema === 'string') {
    var uri = schema;
    baseUri = baseUri || 'http://schema.ninjablocks.com/';
    var resolvedUri = tv4.resolveUrl(baseUri, uri);
    schema = tv4.getSchema(resolvedUri);
    if (!schema) {
      throw new Error('Failed to resolve schema $ref. ' + (urlHistory? Object.keys(urlHistory).join(', ') : uri));
    }
  }

	if (schema.$ref !== undefined) {
		urlHistory = urlHistory || {};
		if (urlHistory[schema.$ref]) {
			throw new Error('Circular reference in schema refs. ' + Object.keys(urlHistory).join(', '));
		}
		urlHistory[schema.$ref] = true;
		schema = this.getSchema(schema.$ref, baseUri, urlHistory);
	}

	return schema;
};


Schemas.prototype.validate = function(schemaUri, data, failMissing) {
  var schema;
  if (typeof schemaUri === 'string') {
    schema = this.getSchema(schemaUri);
  } else {
    schema = schemaUri;
  }

  if (!schema) {
    if (failMissing) {
      var err = util.format('Validation error: Couldn\'t find schema "%s"'.red, schemaUri);
      log.warn(err);
      return err;
    } else {
      log.warn('Couldn\'t find schema "%s". Passing without checks...'.red, schemaUri);
      return null;
    }
  }

  log.trace('Validating', data, 'with', JSON.stringify(schema));

  var result = tv4.validateResult(data, schema, true, true);

  if (result.valid) {
    log.trace('Data passed validation');
    return null;
  } else {
    log.warn('Data did not pass validation using schema', schema.id || JSON.stringify(schema));
    var message = util.format('Validation error: %s at %s', result.error.message.red, (result.error.dataPath || 'root').yellow);
    log.warn(message);
    log.trace('Invalid data :', JSON.stringify(data));
    return message;
  }

};

// why isn't this a thing...
function map(obj, fn) {
  if (!obj) return;
  var out = {};
  Object.keys(obj).forEach(function(name) {
    out[name] = fn(obj[name], name);
  });
  return out;
}

// NOTE: Memoized
Schemas.prototype.getServiceValidators = _.memoize(function(serviceUri) {
  var service = this.getSchema(serviceUri);

  var validators = {};

  log.trace('Creating service validators for ', serviceUri, service);

  validators.methods = map(service.methods, function(method) {
    return {
      params: this.getParamsValidator(service.id, method.params), // XXX: service.id or serviceUri??
      returns: function(value) {
        if (!method.returns) {
          // No return value needed.
          return;
        }
        var error = this.validate(method.returns.value, value);
        if (error) {
          throw new Error('Invalid return data : ' + error);
        }
      }.bind(this)
    };
  }.bind(this));

  validators.events = map(service.events, function(event) {
    return function(value) {
      if (event.value) {
        var error = this.validate(event.value, value);
        if (error) {
          throw new Error('Invalid event data : ' + error);
        }
      }
    }.bind(this);
  }.bind(this));

  return validators;
});

Schemas.prototype.getParamsValidator = function(serviceUri, params) {

  if (!params || params.length === 0) {
    return function(args) {
      return args.length === 0 ? null : 'This method has no parameters';
    };
  }

  var paramsSchema = {
    type: 'array',
    items: params.map(function(p) {
      return p.value;
    })
  };

  var resolvedParams = params.map(function(param) {
    return this.getSchema(param.value, serviceUri);
  }.bind(this));

  return function(args) {
    if (args.length > resolvedParams.length) {
      throw new Error('Too many arguments');
    }

    // Resolve the default values from the parameter schemas
    var params = resolvedParams.map(function(param, i) {
      if (typeof args[i] === 'undefined') {
        return param.default;
      } else {
        return args[i];
      }
    });

    var error = this.validate(paramsSchema, params);
    if (error) {
      throw new Error('Invalid arguments : ' + error);
    }

    return params;
  }.bind(this);

};

/**
 * Converts an event payload to 0..n time series data points.
 * NOTE: The payload must already have been validated. No validation is done here.
 *
 * @param value {anything|null} The payload of the event. Can be null if there is no payload
 * @param eventSchemaUri {string} The URI of the schema defining the event (usually ends with #/events/{name})
 * @returns {Array} An array of records that need to be saved to a time series db
 */
Schemas.prototype.getEventTimeSeriesData = function(value, eventSchemaUri) {

  var timeseriesData = [];

  var eventSchema = this.getSchema(eventSchemaUri);

  log.trace('Finding time series data for event', eventSchemaUri, 'from payload', value);

  if (!eventSchema) {
    throw new Error('No schema found for uri "' + eventSchemaUri + '"');
  }

  if (eventSchema.value) {
    if (typeof value == 'object') {
      // The payload may have nested properties that need to be stored... so we need to look though the whole tree.
      var flat = flatten(value);

      Object.keys(flat).forEach(function(path) {
        timeseriesData.push(this._getPathTimeSeriesData(flat[path], path, eventSchemaUri + '/value'));
      }.bind(this));

    } else {
      // The payload is a 'simple' value.
      timeseriesData.push(this._getPathTimeSeriesData(value, null, eventSchemaUri + '/value'));
    }
  }

  // If the event itself has timeseries="event", we store it as an event
  timeseriesData.push(this._getPathTimeSeriesData(null, null, eventSchemaUri));

  return timeseriesData.filter(function(v) {return !!v;});
};

Schemas.prototype._getPathTimeSeriesData = function(value, valuePath, schemaUri) {
  var schemaPath;
  if (valuePath) {
    // It's a path on the schema
    schemaPath = [schemaUri].concat(valuePath.split(/\./)).join('/properties/');
  } else {
    // It's the root of the schema
    schemaPath = schemaUri;
  }

  var schema = this.getSchema(schemaPath);

  if (!schema.timeseries) {
    // The resolves schema doesn't define that we will store this in a tsdb.
    return null;
  }

  var data = {
    path: (valuePath||''),
    type: schema.timeseries
  };

  if (schema.timeseries == 'value') {
    data.value = value;
  } else if (schema.timeseries == 'event') {
    // No data is needed for events, its up to the implementing db to decide how they are stored.
  } else if (schema.timeseries == 'boolean') {
    data.value = value?true:false;
  } else {
    throw new Error('Unknown timeseries value type "' + schema.timeseries + '"');
  }

  return data;
};

/*
Outputs big joined schemas, useful for documentation etc.

function clone(o) {
  return JSON.parse(JSON.stringify(o));
}

function resolveLinks(schema, seen) {
  console.log('Resolving', schema, seen);

//  schema = clone(schema);

  // Link the ref if it exists
  if (schema.$ref && typeof schema.$ref == 'string' && !seen[schema.$ref]
    && schema.$ref.indexOf('json-schema.org') === -1) {
    seen[schema.$ref] = true;
    schema.$parent = clone(tv4.getSchema(schema.$ref) || ""); //XXX?
  }

  // Resolve any nested refs
  Object.keys(schema).forEach(function(key) {
    if (typeof schema[key] == 'object') {
      schema[key] = resolveLinks(schema[key], clone(seen));
    }
  });

  return schema;
}

var fatSchemas = schemas.map(function(s) {
  return resolveLinks(s, {});
});
console.log(util.inspect(fatSchemas, { showHidden: true, depth: null, colors:true }));*/

module.exports = new Schemas();
/*

console.log(module.exports.getEventTimeSeriesData({
  rumbling: true,
  x: 0.5,
  y: -0.1,
  z: {
    hello: 2,
    goodbye: 3
  }
}, 'http://schema.ninjablocks.com/protocol/game-controller.joystick#/events/state'));

console.log(module.exports.getEventTimeSeriesData(null,
  'http://schema.ninjablocks.com/protocol/game-controller.joystick#/events/shook'));


console.log(module.exports.getServiceValidators('http://schema.ninjablocks.com/protocol/game-controller.joystick'));*/
