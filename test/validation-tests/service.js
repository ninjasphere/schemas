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
    }
  }

];

var invalid = [
  {
    "methods": {
      "setOnOff": {
        //"description": "Turns the device on or off", // No description
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
  },
  {
    "methods": {
      "setOnOff": {
        "description": "Turns the device on or off",
        "params": [{
          //"name": "state", // No parameter name
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
  schema: "http://schema.ninjablocks.com/service"
};
