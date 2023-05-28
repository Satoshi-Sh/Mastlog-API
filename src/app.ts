import express, { Request, Response } from "express";
const app = express();
import connectDB from "./js/connectDB";
import Toot from "./js/tootSchema";
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3001",
  })
);

connectDB();
//get latest account information to make a header
async function retrieveHeader(res: Response) {
  try {
    const toot = await Toot.findOne({}).sort({
      "data.created_at": -1,
    });
    res.json(toot);
  } catch (err) {
    console.error("Error retrieving toots:", err);
  }
}

//get toots by day
async function tootsDaily(res: Response) {
  try {
    const toots = await Toot.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$data.created_at" },
          },
          count: { $sum: 1 },
          items: { $push: "$$ROOT" },
        },
      },
    ]);
    res.json(toots);
  } catch (err) {
    console.error("Error retrieving toots:", err);
  }
}

app.get("/api/header", (req: Request, res: Response) => {
  retrieveHeader(res);
});

app.get("/api/toots", (req: Request, res: Response) => {
  tootsDaily(res);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
