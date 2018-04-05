const mongoose = require("mongoose");

var PollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
    minLength: 1
  },
  answers: {
    type: Array,
    required: true,
    minLength: 2
  },
  startedAt: {
    type: Number
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

var Poll = mongoose.model("Poll", PollSchema);

module.exports = {Poll};
