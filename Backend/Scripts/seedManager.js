// seedManager.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Manager = require('../Schemas/Manager'); 

const seedManager = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const email = process.env.DEFAULT_MANAGER_EMAIL;
  const plainPassword = process.env.DEFAULT_MANAGER_PASSWORD;

  if (!email || !plainPassword) {
    console.error("Manager email or password not set in environment variables.");
    return process.exit(1);
  }

  const existing = await Manager.findOne({ email });
  if (existing) {
    console.log("Manager already exists.");
    return process.exit();
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  await Manager.create({ email, password: hashedPassword });

  console.log("Default manager created.");
  process.exit();
};

seedManager();
