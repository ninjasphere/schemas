var valid = [
  {
    "title": "Create new security light",
    "sections": [
      {
        "contents": [
          {
            "type": "inputText",
            "name": "name",
            "before": "Name",
            "placeholder": "My Security Light",
            "value": "Front door light"
          },
          {
            "type": "optionGroup",
            "name": "sensors",
            "title": "When these devices detect motion",
            "minimumChoices": 1,
            "options": [
              {
                "title": "Front Door Motion",
                "subtitle": "Motion",
                "value": "fd"
              },
              {
                "title": "Back Door 1",
                "subtitle": "Presence",
                "value": "bd",
                "selected": true
              },
              {
                "title": "Back Door Webcam",
                "subtitle": "Camera",
                "value": "bdc",
                "selected": true
              }
            ]
          },
          {
            "type": "optionGroup",
            "name": "lights",
            "title": "Turn on these lights",
            "minimumChoices": 1,
            "options": [
              {
                "title": "Front Door",
                "subtitle": "Lamp in Hallway",
                "value": "fd"
              },
              {
                "title": "Front Door Spotlight",
                "subtitle": "Light in Front Step",
                "value": "fds",
              },
              {
                "title": "Above Fridge",
                "subtitle": "Lamp in Kitchen",
                "value": "kl",
              },
              {
                "title": "Broken",
                "subtitle": "Light in Backyard",
                "value": "bdf",
                "selected": true
              }
            ]
          },
          {
            "type": "inputTimeRange",
            "name": "time",
            "title": "When",
            "value": {
              "from": "10:00",
              "to": "sunset"
            }
          },
          {
            "title": "Turn off again after",
            "type": "inputText",
            "after": "minutes",
            "name": "timeout",
            "inputType": "number",
            "minimum": 0,
            "value": 5
          }
        ]
      }
    ],
    "actions": [
      {
        "type": "close",
        "label": "Cancel"
      },
      {
        "type": "reply",
        "label": "Save",
        "name": "save",
        "displayClass": "success",
        "displayIcon": "star"
      }
    ]
  },
  {
    "title": "Security Lights",
    "subtitle": "(lux securitatem)",
    "sections": [
      {
        "title": "Your Lights",
        "subtitle": "So motion. Much photon.",
        "well": true,
        "contents": [
          {
            "type": "alert",
            "title": "New Feature v1.2",
            "subtitle": "Presets are now supported",
            "displayClass": "info"
          }/*,
          {
            "type": "actionList",
            "name": "light",
            "options": [
              {
                "title": "Lounge Room",
                "subtitle": "2 sensors, 3 lights",
                "value": "lounge"
              },
              {
                "title": "Front Door",
                "subtitle": "1 sensor, 1 light",
                "value": "front-door"
              }
            ],
            "primaryAction": {
              "type": "reply",
              "name": "editLight",
              "displayIcon": "pencil"
            },
            "secondaryAction": {
              "type": "reply",
              "name": "deleteLight",
              "label": "Delete",
              "displayIcon": "trash",
              "displayClass": "danger"
            }
          }*/
        ]
      }
    ],
    "actions": [
      {
        "type": "close",
        "label": "Cancel"
      },
      {
        "type": "reply",
        "label": "Add New",
        "name": "add",
        "displayClass": "success",
        "displayIcon": "star"
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
