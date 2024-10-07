const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  contact: { type: String, required: true },
  nic: { type: String, required: true },
  role: { type: String, default: "admin" },
  doctors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
  ],
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  ],
  interns: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Intern",
    },
  ],
});

module.exports = mongoose.model("Admin", adminSchema);
