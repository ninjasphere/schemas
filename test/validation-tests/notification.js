var valid = [
  // A notification with an embedded config form
  {
    title: 'You have too many Hue base-stations',
    subtitle: 'You should remove at least one',
    category: 'query',
    priority: 'low',
    replyTo: {
      topic: "$driver/com.ninjablocks.hue/service",
      method: "removeBaseStations"
    },
    clearAction: {
      type: "reply",
      label: "Ignore",
      name: "ignore"
    },
    actions: [
      {
        type: "reply",
        label: "Ignore",
        displayClass: "default",
        name: "ignore"
      },
      {
        type: "configuration",
        label: "Choose",
        displayClass: "primary",
        screen: {
          "title": "Unpair Hue base stations",
          "sections": [
            {
              "title": "Please choose the stations you wish to unpair",
              "contents": [
                {
                  "type": "optionGroup",
                  "name": "station",
                  "title": "Stations",
                  "minimumChoices": 1,
                  "options": [
                    {
                      "title": "Lounge Room",
                      "value": "lounge1234"
                    },
                    {
                      "title": "Kitchen",
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
              "name": "cancelled",
              "displayIcon": "warning"
            },
            {
              "type": "reply",
              "label": "Unpair",
              "name": "unpair",
              "displayClass": "primary",
              "displayIcon": "delete"
            }
          ]
        }
      }
    ]
  },
  {
    title: 'Please press the pairing button on your Philips Hue base-station',
    subtitle: 'New Hue base-station found',
    priority: 'high',
    category: 'suggestion'
  },
  {
    title: 'The fire alarm in "Lounge Room" is alerting!',
    priority: 'max',
    category: 'alert',
    clearable: false,
    image: {
      type: 'image',
      src: "http://sphere.ninja/this.is.the.url.of.a.photo.from.a.camera.in.the.room.jpg"
    },
    clickAction: {
      type: 'link',
      label: 'Open Room',
      uri: 'sphere:room:ab251d73hdhfddf'
    },
    actions: [
      {
        type: 'link',
        label: 'Open Room',
        uri: 'sphere:room:ab251d73hdhfddf',
        displayIcon: 'house'
      },
      {
        type: 'link',
        uri: 'tel:+61403773719',
        label: 'Call Elliot',
        displayClass: 'primary',
        displayIcon: 'phone'
      },
      {
        type: 'link',
        uri: 'tel:112',
        label: 'Call Emergency Services',
        displayClass: 'danger',
        displayIcon: 'emergency'
      }
    ]
  }
];

var invalid = [
];

module.exports = {
  valid: valid,
  invalid: invalid,
  schema: "http://schema.ninjablocks.com/state/notification"
};
