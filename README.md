# 🌟 LinkSpark - URL Shortener

> A beautiful, fast, and reliable URL shortener with a golden touch ✨

![LinkSpark](https://i.ibb.co/WNfM62nJ/Link-Spark.png) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![Express](https://img.shields.io/badge/Express-4.x-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)

## 🚀 Features

- **✨ Beautiful UI**: Smooth gradient theme with animated sparkles
- **⚡ Fast & Reliable**: Quick URL shortening with MongoDB storage
- **📱 Responsive Design**: Works perfectly on desktop and mobile
- **📋 One-Click Copy**: Easy copy-to-clipboard functionality
- **📊 Analytics**: Track click counts and creation dates
- **🔍 URL Validation**: Smart URL format validation

## 🛠️ Tech Stack

**Frontend:**
- HTML5
- CSS3 (with animations and gradients)
- Vanilla JavaScript
- Responsive Design

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Clone Repository
```bash
git clone https://github.com/Hamood268/LinkSpark.git
cd linkSpark
```

### Install Dependencies
```bash
npm install
```

### Start the Application
```bash

# Production mode
npm start
```

Visit `http://localhost:8000` in your browser!

## 🔌 API Endpoints

### Shorten URL
```http
POST /api/shorten
Content-Type: application/json

{
  "url": "https://example.com/very-long-url"
}
```

**Response:**
```json
{
  "success": true,
  "originalUrl": "https://example.com/very-long-url",
  "shortenedUrl": "http://localhost:8000/abc123",
  "shortCode": "abc123",
  "clicks": 0,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Redirect to Original URL
```http
GET /:shortCode
```
Redirects to the original URL and increments click counter.

## 🤝 Contributing

1. Fork the repository
2. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

My Socials:
- GitHub: [github.com/hamood268](https://github.com/hamood268)
- Discord: [@ha268h](https://discord.com/users/804230882693087242)
- Support me: [paypal](https://paypal.me/Mohammed0268)

*Developed with passion by Mohammed*

⭐ **Star this repo if you find it helpful!** ⭐

---