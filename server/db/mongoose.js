var mongoose = require("mongoose");

mongoose.Promise = global.Promise;

var dbUri;
if (process.env.MONGODB_URI) {
  dbUri = process.env.MONGODB_URI
} else {
  dbUri = "mongodb://localhost:27017/VotingApp";
}
// var dbUri = "mongodb://localhost:27017/VotingApp";

mongoose.connect(dbUri, {
  useMongoClient: true
});

module.exports = {mongoose};
