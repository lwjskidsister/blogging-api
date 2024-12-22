const mongoose = require("mongoose");
const User = require("../models/User");
const Blog = require("../models/Blog");

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://agneskamilindi:eBuO2whAc4qpJA61@bloggingcluster.ssg92.mongodb.net/bloggingapidb?retryWrites=true&w=majority";

async function testModels() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for testing.");

    // Test User Model
    const user = new User({
      first_name: "Agnes",
      last_name: "Test",
      email: "agnes@example.com",
      password: "password123",
    });

    const savedUser = await user.save();
    console.log("User saved successfully:", savedUser);

    // Test Blog Model
    const blog = new Blog({
      title: "My First Blog",
      description: "This is a test blog.",
      author: savedUser._id,
      tags: ["test", "blog"],
      body: "This is the body of my first blog. It has some content.",
    });

    const savedBlog = await blog.save();
    console.log("Blog saved successfully:", savedBlog);

    // Fetch the blog and populate the author field
    const fetchedBlog = await Blog.findById(savedBlog._id).populate("author");
    console.log("Fetched Blog with Author:", fetchedBlog);
  } catch (error) {
    console.error("Error during testing:", error);
  } finally {
    mongoose.connection.close();
  }
}

testModels();
