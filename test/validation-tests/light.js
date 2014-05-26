var valid = [
  {
    power: false
  },
  {
    power: true,
    hue: 0.2
  },
  {
    power: true,
    hue: 0.2,
    saturation: 0.4
  }
];

var invalid = [
  'hello',
  {},
  {
    hue: 0.2
  },
  {
    power: true,
    hue: 1.2
  },
  {
    power: false,
    saturation: 0.7
  }
];

module.exports = {
  valid: valid,
  invalid: invalid,
  schema: "http://schema.ninjablocks.com/state/light"
};
