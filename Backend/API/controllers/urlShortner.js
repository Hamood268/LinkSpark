const express = require("express");
const schema = require("../../Database/Schema/urlSchema.js");
const { body, validationResult } = require("express-validator");
const router = express.Router();

function generateShortCode() {
  const length = 6;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

async function shortneningUrl() {

  router.post(
    "/",
    [body("url").notEmpty().withMessage("URL is required")],
    async (req, res) => {
      try {
        const { url } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array(),
          });
        }

        console.log("User submitted URL:", url);

      const shortCode = generateShortCode();
      
      const existingUrl = await schema.findOne({ shortenUrl: shortCode });
      if (existingUrl) {
        // Generate new code if collision occurs
        return res.status(500).json({
          success: false,
          message: "Code generation collision. Please try again."
        });
      }

        const savedUrl = new schema({
          url: url,
          shortenUrl: id,
          urlUsage: 0,
        });

        await savedUrl.save();

        const response = {
          success: true,
          originalUrl: url,
          shortCode: shortCode,
          shortenedUrl: process.env.BaseURl`${shortCode}`,
          visits: 0,
          createdAt: savedUrl.createdAt,
        };

        res.status(201).json(response);
      } catch (err) {
        console.log("error in shortening the url", err);
        res.status(500).json({
          code: 500,
          message: "error in shortnening the url",
        });
      }
    }
  );
}

module.exports = { shortneningUrl };
