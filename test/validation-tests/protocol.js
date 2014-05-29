var valid = [

  {
    "methods": {
      "setOnOff": {
        "description": "Turns the device on or off",
        "params": [{
          "name": "state",
          "value": { "$ref": "/state/common#/definitions/boolean-state" }
        }],
        "returns": {
          "description": "The new state",
          "$ref": "/state/common#/definitions/boolean-state"
        }
      }
    },
    "events": {
      "state": {"$ref": "/state/common#/definitions/boolean-state"}
    }
  }

];

var invalid = [
  { // No state event
    "methods": {
      "setOnOff": {
        "description": "Turns the device on or off",
        "params": [{
          "name": "state",
          "value": { "$ref": "/state/common#/definitions/boolean-state" }
        }],
        "returns": {
          "description": "The new state",
          "$ref": "/state/common#/definitions/boolean-state"
        }
      }
    },
    "events": {
      "something-else": { "$ref": "/state/common#/definitions/boolean-state" }
    }
  },
  { // No state event
    "methods": {
      "setOnOff": {
        "description": "Turns the device on or off",
        "params": [{
          "name": "state",
          "value": { "$ref": "/state/common#/definitions/boolean-state" }
        }],
        "returns": {
          "description": "The new state",
          "$ref": "/state/common#/definitions/boolean-state"
        }
      }
    }
  }
];

module.exports = {
  valid: valid,
  invalid: invalid,
  schema: "http://schema.ninjablocks.com/protocol"
};
