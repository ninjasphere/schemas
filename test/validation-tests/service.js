var valid = [

  {
    "methods": {
      "setOnOff": {
        "description": "Turns the device on or off",
        "params": [{"$ref": "/state/common#/definitions/boolean-state"}],
        "returns": {
          "description": "The new state",
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
  schema: "http://schema.ninjablocks.com/service"
};
