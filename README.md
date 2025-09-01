# MedLoop

MedLoop is an AI-powered medical report analyzer. Users can upload or paste medical reports, receive instant summaries, emergency detection, and suggestions for nearby hospitals.

## ✨ Features

- Upload or paste medical reports
- AI-generated summaries
- Emergency detection and response
- Find nearby hospitals using geolocation
- Modern React frontend with Lucide icons and gradient background

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express, OpenAI API
- **Database:** (see below)
- **Geolocation & Hospital Search:** OpenStreetMap Nominatim API

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the backend

```bash
cd backend
npm install
npm start
```

### 3. Start the frontend

```bash
cd ..
npm start
```

### 4. Use the app

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database

MedLoop uses **MongoDB** to store medical reports and user data.

### How to add MongoDB:

1. Install MongoDB and the `mongoose` package:
   ```bash
   npm install mongoose
   ```
2. Connect to MongoDB in your backend (`backend/server.js`):
   ```js
   const mongoose = require('mongoose');
   mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
   ```
3. Create models for reports and users in `backend/models/`.

4. Update your analysis route to save analyzed reports to the database.

---

## 📦 Environment Variables

- Add your OpenAI API key and MongoDB URI to `backend/.env`:
  ```
  OPENAI_API_KEY=your_openai_api_key
  MONGO_URI=mongodb://localhost:27017/medloop
  ```

---

## 📝 Notes

- For demo/testing, all analysis is done in-memory.
- To store reports or user data, integrate a database as described above.
