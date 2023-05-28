import express, { Request, Response } from "express";
const app = express();
import connectDB from "./js/connectDB";
import Toot from "./js/tootSchema";

connectDB();
//get latest account information to make a header
async function retrieveHeader(res: Response) {
  try {
    const toot = await Toot.findOne({}, "data.account").sort({
      "data.created_at": -1,
    });
    res.json(toot);
  } catch (err) {
    console.error("Error retrieving toots:", err);
  }
}

app.get("/api/header", (req: Request, res: Response) => {
  retrieveHeader(res);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
