var valid = [
  {
    "message": "Hello"
  },
  {
    "message": "Hello",
    "title": "My Message"
  },
  {
    "message": "Hello",
    "title": "My Message",
    "image": "http://example.com/image.jpg"
  }
];


var invalid = [
  "hello",
  {
    "message": 12345
  },
  {
    "message": "Hello",
    "image": "hello.jpg"
  },
  {
    "message": "Hello",
    "image": "ftp://hello.jpg"
  },
  {
    "title": "My Message"
  }
];

module.exports = {
  valid: valid,
  invalid: invalid,
  schema: "http://ninjablocks.com/schema/state/message"
};
