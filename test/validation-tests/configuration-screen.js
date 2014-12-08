var valid = [
  {
    "title": "Unpair Hue base stations",
    "sections": [
      {
        "title": "Please choose the stations you wish to unpair",
        "contents": [
          {
            "type": "inputChoice",
            "name": "station",
            "label": "Stations",
            "minimumChoices": 1,
            "options": [
              {
                "label": "Lounge Room",
                "value": "lounge1234"
              },
              {
                "label": "Kitchen",
                "value": "kitchen1234"
              }
            ]
          }
        ]
      }
    ],
    "actions": [
      {
        "type": "reply",
        "label": "Cancel",
        "name": "cancelled"
      },
      {
        "type": "reply",
        "label": "Unpair",
        "name": "unpair"
      }
    ]
  }
];

var invalid = [];

module.exports = {
  valid: valid,
  invalid: invalid,
  schema: "http://schema.ninjablocks.com/state/configuration-screen"
};
