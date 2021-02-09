const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const testScoreSchema = mongoose.Schema({
  round_one_score: {
    type: Number,
    min: 0,
    max: 10,
  },
  round_two_score: {
    type: Number,
    min: 0,
    max: 10,
  },
  round_three_score: {
    type: Number,
    min: 0,
    max: 10,
  },
  total_score: {
    type: Number,
    min: 0,
    max: 30,
  },
  candidate: {
    type: ObjectId,
    ref: "Candidate",
    required: true,
  },
});
testScoreSchema
  .virtual("round_one")
  .set(function (round_one) {
    this._score = round_one;
    this.round_one_score = round_one;
    this.total_score = round_one;
  })
  .get(function () {
    return this._score;
  });

module.exports = mongoose.model("TestScore", testScoreSchema);
