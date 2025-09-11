require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const analysisRoutes = require('./routes/analysisRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/medloop", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use('/api/analysis', analysisRoutes);

app.get("/", (req, res) => {
  res.send("MedLoop backend is running!");
});

// Basic error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});