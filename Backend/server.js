const express = require("express");
const cors = require("cors");
const path = require("node:path");
const app = express();
const PORT = process.env.PORT || 8000;

const urlShortenerRouter = require("./API/controllers/urlShortner.js");
const { connectDB } = require("./Database/mongodb.js");

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "../Frontend")));

app.use("/api/shorten", urlShortenerRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/index.html"));
});

app.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;
    const schema = require("./Database/Schema/urlSchema.js");
    
    const urlDoc = await schema.findOne({ shortenUrl: shortCode });
    
    if (!urlDoc) {
      return res.status(404).json({
        success: false,
        message: "Shortened URL not found"
      });
    }
    
    urlDoc.urlUsage += 1;
    await urlDoc.save();
    
    // Redirect to original URL
    res.redirect(301, urlDoc.url);
    
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).json({
      code: 500,
      success: false,
      message: "Internal server error"
    });
  }
});

async function startServer() {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server connected on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();