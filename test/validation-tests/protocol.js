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
          "value": {
            "$ref": "/state/common#/definitions/boolean-state"
          }
        }
      }
    },
    "events": {
      "state": {
        "value": {
          "$ref": "/state/common#/definitions/boolean-state"
        }
      }
    }
  }

];

var invalid = [];

module.exports = {
  valid: valid,
  invalid: invalid,
  schema: "http://schema.ninjablocks.com/protocol"
};
