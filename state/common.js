{
  "id": "http://ninjablocks.com/schema/state/common",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "Common NinjaBlocks state definitions",
  "definitions": {
    "number-timeseries": {
      "description": "Used for a state object, it indicates that this property should be stored in the time-series database.",
      "type": "number"
    },
    "boolean-state": {
      "description": "true=on, false=off",
      "type": "boolean"
    }
  }
}
