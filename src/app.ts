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
        $sort: {
          "data.created_at": -1,
        },
      },
      {
        $group: {
          _id: {
            day: {
              $dateToString: { format: "%Y-%m-%d", date: "$data.created_at" },
            },
            dayName: {
              $isoDayOfWeek: "$data.created_at",
            },
          },
          count: { $sum: 1 },
          items: { $push: "$$ROOT" },
        },
      },
      {
        $sort: {
          "_id.day": -1, // Sort by day in ascending order
        },
      },
    ]);

    res.json(toots);
  } catch (err) {
    console.error("Error retrieving toots:", err);
  }
}

//get toots by day with hashtag filter;
async function tootsDailyHashtag(req: Request, res: Response) {
  const value = req.params.value;
  try {
    const toots = await Toot.aggregate([
      {
        $match: { "data.tags": { $elemMatch: { name: value } } },
      },
      {
        $sort: {
          "data.created_at": -1,
        },
      },

      {
        $group: {
          _id: {
            day: {
              $dateToString: { format: "%Y-%m-%d", date: "$data.created_at" },
            },
            dayName: { $isoDayOfWeek: "$data.created_at" },
          },
          count: { $sum: 1 },
          items: { $push: "$$ROOT" },
        },
      },
      {
        $sort: {
          "_id.day": -1,
        },
      },
    ]);

    res.json(toots);
  } catch (err) {
    console.error("Error retrieving toots:", err);
  }
}

//get toots by day with day filter;
async function tootsDailyDate(req: Request, res: Response) {
  const day = new Date(req.params.value);
  try {
    const toots = await Toot.aggregate([
      {
        $match: {
          $expr: {
            $eq: [
              {
                $dateToString: { format: "%Y-%m-%d", date: "$data.created_at" },
              },
              { $dateToString: { format: "%Y-%m-%d", date: day } },
            ],
          },
        },
      },
      {
        $sort: {
          "data.created_at": -1,
        },
      },

      {
        $group: {
          _id: {
            day: {
              $dateToString: { format: "%Y-%m-%d", date: "$data.created_at" },
            },
            dayName: { $isoDayOfWeek: "$data.created_at" },
          },
          count: { $sum: 1 },
          items: { $push: "$$ROOT" },
        },
      },
      {
        $sort: {
          "_id.day": -1,
        },
      },
    ]);

    res.json(toots);
  } catch (err) {
    console.error("Error retrieving toots:", err);
  }
}

//get toots by day with friend filter;
async function tootsDailyFriend(req: Request, res: Response) {
  const account_name = req.params.value;
  try {
    const toots = await Toot.aggregate([
      {
        $match: { "data.mentions": { $elemMatch: { username: account_name } } },
      },
      {
        $sort: {
          "data.created_at": -1,
        },
      },

      {
        $group: {
          _id: {
            day: {
              $dateToString: { format: "%Y-%m-%d", date: "$data.created_at" },
            },
            dayName: { $isoDayOfWeek: "$data.created_at" },
          },
          count: { $sum: 1 },
          items: { $push: "$$ROOT" },
        },
      },
      {
        $sort: {
          "_id.day": -1,
        },
      },
    ]);

    res.json(toots);
  } catch (err) {
    console.error("Error retrieving toots:", err);
  }
}

//get recents by day
async function getRecent(res: Response) {
  try {
    const toots = await Toot.aggregate([
      {
        $sort: {
          "data.created_at": -1,
        },
      },
      {
        $group: {
          _id: {
            day: {
              $dateToString: { format: "%Y-%m-%d", date: "$data.created_at" },
            },
            dayName: {
              $isoDayOfWeek: "$data.created_at",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.day": -1, // Sort by day in ascending order
        },
      },
      { $limit: 15 },
    ]);

    res.json(toots);
  } catch (err) {
    console.error("Error retrieving toots:", err);
  }
}

// get hashtags by count
async function getHashTags(res: Response) {
  try {
    const toots = await Toot.aggregate([
      { $unwind: "$data.tags" }, // Flatten the mentions array
      {
        $group: {
          _id: "$data.tags.name", // Group by the username in mentions
          count: { $sum: 1 }, // Count the occurrences
        },
      },
      { $sort: { count: -1 } },
      { $limit: 100 },
    ]);

    res.json(toots);
  } catch (err) {
    console.error("Error retrieving toots:", err);
  }
}

// get friends by count
async function getFriends(res: Response) {
  try {
    const toots = await Toot.aggregate([
      { $unwind: "$data.mentions" }, // Flatten the mentions array
      {
        $group: {
          _id: "$data.mentions.username", // Group by the username in mentions
          count: { $sum: 1 }, // Count the occurrences
          url: { $first: "$data.mentions.url" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 100 },
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

app.get("/api/friends", (req: Request, res: Response) => {
  getFriends(res);
});

app.get("/api/hashtags", (req: Request, res: Response) => {
  getHashTags(res);
});

app.get("/api/hashtags/:value", (req: Request, res: Response) => {
  tootsDailyHashtag(req, res);
});

app.get("/api/date/:value", (req: Request, res: Response) => {
  tootsDailyDate(req, res);
});

app.get("/api/friends/:value", (req: Request, res: Response) => {
  tootsDailyFriend(req, res);
});

app.get("/api/recent", (req: Request, res: Response) => {
  getRecent(res);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
