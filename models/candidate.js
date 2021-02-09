const mongoose = require("mongoose");

const candidateSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxlength: 10,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("Candidate", candidateSchema);
