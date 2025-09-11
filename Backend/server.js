const express = require("express");
const cors = require("cors");
const path = require("node:path");
const app = express();
const PORT = 8000;

const { shortneningUrl } = require("./API/controllers/urlShortner.js");

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "../Frontend")));

app.use("/api", shortneningUrl);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server connected on port http://localhost:${PORT}`);
});
