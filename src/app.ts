import express, { Request, Response } from "express";
const app = express();
import connectDB from "./js/connectDB";
const mongoose = require("mongoose");

connectDB();
const tootSchema = new mongoose.Schema({
  // Define the schema fields here
  // Example: title: String,
  //         content: String,
  //         createdAt: Date,
});
const Toot = mongoose.model("Toot", tootSchema);
async function retrieveToots() {
  try {
    const toots = await Toot.find({});
    console.log("Retrieved toots:", toots);
  } catch (err) {
    console.error("Error retrieving toots:", err);
  }
}

app.get("/", (req: Request, res: Response) => {
  retrieveToots();
  res.send("Hello, Express!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
