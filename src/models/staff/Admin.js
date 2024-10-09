const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Hashing the password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password for login
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);



// const mongoose = require("mongoose");

// const adminSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   username: { type: String, required: true },
//   password: { type: String, required: true },
//   name: { type: String, required: true },
//   contact: { type: String, required: true },
//   nic: { type: String, required: true },
//   role: { type: String, default: "admin" },
//   doctors: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Doctor",
//     },
//   ],
//   admins: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Admin",
//     },
//   ],
//   interns: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Intern",
//     },
//   ],
// });

// module.exports = mongoose.model("Admin", adminSchema);
