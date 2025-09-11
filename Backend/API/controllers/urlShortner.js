const express = require("express");
const schema = require("../../Database/Schema/urlSchema.js");
const { body, validationResult } = require("express-validator");
const router = express.Router();

// Generate random short code
function generateShortCode() {
  const length = 6;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// POST route for shortening URLs
router.post(
  "/",
  [body("url").notEmpty().withMessage("URL is required").isURL().withMessage("Must be a valid URL")],
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

      // Generate unique short code
      const shortCode = generateShortCode();
      
      // Check if short code already exists (optional but recommended)
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
        shortenUrl: shortCode,
        urlUsage: 0,
      });

      const result = await savedUrl.save();

      const baseUrl = process.env.BASE_URL || "http://localhost:8000";
      
      const response = {
        success: true,
        originalUrl: url,
        shortCode: shortCode,
        shortenedUrl: `${baseUrl}/${shortCode}`,
        createdAt: result.createdAt,
        clicks: 0
      };

      res.status(201).json(response);
      
    } catch (err) {
      console.error("Error in shortening the URL:", err);
      res.status(500).json({
        success: false,
        message: "Internal server error while shortening URL",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }
);

module.exports = router;