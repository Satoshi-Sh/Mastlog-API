const mongoose = require("mongoose");
require("dotenv").config();

const databaseURL: any = process.env["DATABASE_URL"];
// Connect to MongoDB using the DATABASE_URL environment variable
const connectDB = async () => {
  try {
    await mongoose.connect(databaseURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected!!");
  } catch (err) {
    console.error("Failed to connect to MongoDB" + err);
  }
};
export default connectDB;
