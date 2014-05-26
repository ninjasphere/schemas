var valid = [
  [100,0,200,300,0,150,0,150],
  [100,0]
];

var invalid = [
  "hello",
  {
    "message": 12345
  },
  [-10],
  [],
  [40000],
  ["10"],
  [100,null]
];

module.exports = {
  valid: valid,
  invalid: invalid,
  schema: "http://schema.ninjablocks.com/state/vibration-pattern"
};
