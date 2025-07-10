const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config(); // load env variables

const app = express();
app.use(express.json()); // to parse JSON requests

// Connect MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected successfully");
})
.catch((err) => {
  console.error("❌ MongoDB connection failed:", err.message);
});

// User schema and model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
});
const User = mongoose.model("User", userSchema);

// Admin email array (for fallback)
const adminEmails = ["sammassammas691@gmail.com", "admin@gmail.com"];

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    // Prefer role-based admin check
    if (user.role === "admin") {
      return res.json({ message: "Login successful!", role: "admin", email: user.email });
    }
    // Fallback: check adminEmails array
    if (adminEmails.includes(user.email)) {
      return res.json({ message: "Login successful! (legacy admin)", role: "admin", email: user.email });
    }
    // Default: user
    return res.json({ message: "Login successful!", role: "user", email: user.email });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error." });
  }
});

// Simple route
app.get("/", (req, res) => {
  res.send("Hello Chemmu 🚀");
});

app.post('/register', async (req, res) => {
  const { email, password , role} = req.body;
  try {
    const user = await User.save({email, password, role});

  }
})


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
}); 