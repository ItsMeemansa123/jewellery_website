const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");

async function makeAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.log("⚠️ Please provide an email address.");
    console.log("Usage: node makeAdmin.js user@example.com");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);

    const user = await User.findOne({ email: email.trim() });
    if (!user) {
      console.log(`User with email "${email}" not found!`);
      console.log("Make sure you have signed up with this email on the website first.");
      await mongoose.disconnect();
      process.exit(1);
    }

    user.role = "admin";
    await user.save();

    console.log(`\n SUCCESS! User "${user.name}" (${user.email}) is now an ADMIN!`);
    console.log("You can now login and access the Admin Dashboard at: /admin\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(" Error updating admin role:", err);
    process.exit(1);
  }
}

makeAdmin();
