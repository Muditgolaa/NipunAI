import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,      // no two users can share an email
      lowercase: true,   // store emails in lowercase for consistent lookups
      trim: true,
    },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }   // auto-adds createdAt and updatedAt fields
);

export default mongoose.model("User", userSchema);