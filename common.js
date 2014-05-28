{
  "id": "http://schema.ninjablocks.com/common",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "Common NinjaBlocks definitions",
  "definitions": {
    "device-id": {
      "title": "Device identifier",
      "description": "10 hex characters",
      "type": "string",
      "pattern": "^[0-9a-f]{10}$"
    },
    "channel-id": {
      "title": "Channel identifier",
      "description": "10 hex characters",
      "type": "string",
      "pattern": "^[0-9a-f]{10}$"
    }
  }
}
