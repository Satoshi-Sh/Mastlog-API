const mongoose = require("mongoose");
require("dotenv").config();

const options = {
  tls: true,
  tlsCertificateKeyFile: "/etc/ssl/mongodb.pem",
  tlsAllowInvalidCertificates: true,
};

const databaseURL: any = process.env["DATABASE_URL"];
// Connect to MongoDB using the DATABASE_URL environment variable
const connectDB = async () => {
  try {
    await mongoose.connect(databaseURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ...options,
    });
    console.log("MongoDB connected!!");
  } catch (err) {
    console.error("Failed to connect to MongoDB" + err);
  }
};
export default connectDB;
