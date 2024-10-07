const mongoose = require("mongoose");

const infoHubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  doc: { type: String, required: true },
  category: { type: String, required: true },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",  // This refers to who uploaded it
    required: true,
  },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("InfoHub", infoHubSchema);
