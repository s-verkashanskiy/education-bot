const { Schema, model } = require("mongoose");


const configSchema = new Schema({
  publPeriod: {
    type: Number,
    default: 1440
  },
  lastPublDate: {
    type: String
  },
  testMode: {
    type: Boolean,
    default: false
  },
  tester: {
    type: Number,
    default: 1115435792
    // default: 1183145896
  },
  mentor: {
    type: Number,
    default: 180415302
    // default: 1183145896
  },
  supervisor: {
    type: Number,
    default: 642982892
  },
  postingIsActive: {
    type: Boolean,
    default: true
  },
  messageQueue: [
    {
      tl_id: Number,
      function: String,
      date: String,
      delay: Number,
    }
  ],
});



const Config = model("Config", configSchema);

module.exports = { Config };
