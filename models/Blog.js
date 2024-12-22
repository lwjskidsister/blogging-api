const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  state: { type: String, enum: ["draft", "published"], default: "draft" },
  read_count: { type: Number, default: 0 },
  reading_time: { type: String },
  tags: [String],
  body: { type: String, required: true },
}, { timestamps: true });

// Calculate reading time based on word count
BlogSchema.pre("save", function (next) {
  const words = this.body.split(" ").length;
  const minutes = Math.ceil(words / 200); // Average reading speed is 200 words/minute
  this.reading_time = `${minutes} min read`;
  next();
});

const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;
