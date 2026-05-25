import mongoose from "mongoose";

const scanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  url: {
    type: String,
    required: true,
  },
  results: {
    type: Object,
  },
}, { timestamps: true });

const Scan = mongoose.model("Scan", scanSchema);

export default Scan;