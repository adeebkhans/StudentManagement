// seedManager.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Manager = require('../Schemas/Manager'); 

const seedManager = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const email = process.env.DEFAULT_MANAGER_EMAIL;
    const plainPassword = process.env.DEFAULT_MANAGER_PASSWORD;

    if (!email || !plainPassword) {
      console.error("Manager email or password not set in environment variables.");
      return process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const existing = await Manager.findOne({ email });

    if (existing) {
      // Update password if manager exists
      existing.password = hashedPassword;
      await existing.save();
      console.log("Manager password updated.");
      return process.exit();
    }

    await Manager.create({ email, password: hashedPassword });
    console.log("Default manager created.");
    process.exit();
  } catch (err) {
    console.error("Error in seedManager:", err);
    process.exit(1);
  }
};

seedManager();
