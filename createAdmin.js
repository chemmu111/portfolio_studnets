const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
});
const User = mongoose.model("User", userSchema);

async function createAdmin(email, password) {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hash, role: "admin" });
  await user.save();
  console.log(`Admin user created: ${email}`);
  await mongoose.disconnect();
}

// Usage: node createAdmin.js admin@gmail.com password123
const [,, email, password] = process.argv;
if (!email || !password) {
  console.log("Usage: node createAdmin.js <sammassammas691@gmail.com> <chemmu@123>");
  process.exit(1);
}
createAdmin(email, password).catch(err => {
  console.error("Error creating admin:", err);
  process.exit(1);
}); 