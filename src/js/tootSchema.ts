const mongoose = require("mongoose");

const tootSchema = new mongoose.Schema({
  // Define the schema fields here
  // Example: title: String,
  //         content: String,
  //         createdAt: Date,
});
const Toot = mongoose.model("Toot", tootSchema);

export default Toot;
