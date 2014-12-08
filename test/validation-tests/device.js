var valid = [
  {
    "name": "Office",
    "id": "cb3a5d6402",
    "naturalIdType": "sonos",
    "naturalId": "asjdg^NCSDHd7",
    "signatures": {
      "ninja:manufacturer": "Sonos",
      "ninja:productName": "Sonos Player",
      "ninja:productType": "MediaPlayer",
      "ninja:thingType": "MediaPlayer"
    },
    "thing": "12d648e0-8158-428a-8b9b-fedb7e7f55a3",
    "channels": [{
      "id": "media",
      "protocol": "media",

      "topic": "$device/cb3a5d6402/channels/media",
      "schema": "http://schemas.ninjablocks.com/protocol/media",
      "supportedMethods": ["playUrl"],
      "supportedEvents": ["state"]
    }],

    "topic": "$device/cb3a5d6402",
    "schema": "http://schemas.ninjablocks.com/service/device",
    "supportedMethods": ["start", "stop"],
    "supportedEvents": [],
  }
];

var invalid = [];

module.exports = {
  valid: valid,
  invalid: invalid,
  schema: "http://schema.ninjablocks.com/model/device"
};
