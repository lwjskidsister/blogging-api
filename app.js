const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// routes -----------------------------------------------------------------
// Base route
app.get("/", (req, res) => {
    res.send("Welcome to the Blogging API!");
});

app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.use((req, res) => {
    res.status(404).json({ message: "Endpoint not found" });
});

