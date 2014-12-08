var valid = [
  {
    url: 'http://ninjablocks.com',
    method: 'GET',
    headers: {
      'my-important-user-id': 'abc1234'
    }
  },
  {
    "url": "http://mywebhookserver.com/?device={{.device.name}}",
    "method": "POST",
    "headers": {
      "my-important-user-id": "abc1234",
      "content-type": "text/xml"
    },
    "entity": {
      "type": "string",
      "body": "<my-payload name=\"my thing\" date=\"{{date \"ddMMyyyy\"}}\"/>"
    }
  }
];

var invalid = [
  {
    url: 'http://ninjablocks.com',
    method: 'GET',
    headers: {
      'my-important-user-id': 'abc1234',
      'content-type': 'text/xml'
    },
    entity: {
      type: 'string',
      body: '<my-payload name="my thing" date="{{date "ddMMyyyy"}}"/>'
    }
  }
];

module.exports = {
  valid: valid,
  invalid: invalid,
  schema: "http://schema.ninjablocks.com/service/webhooks#/definitions/webhook"
};
