const Blog = require("../models/Blog"); // Import the Blog model
const calculateReadingTime = (text) => {
  // Simple reading time algorithm: 200 words/min
  const words = text.split(" ").length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
};

// blog creation ----------------------------------------------------------

const createBlog = async (req, res) => {
  try {
    const { title, description, tags, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required" });
    }

    // Check if the title already exists
    const existingBlog = await Blog.findOne({ title });
    if (existingBlog) {
      return res.status(400).json({ message: "A blog with this title already exists" });
    }

    const newBlog = new Blog({
      title,
      description,
      tags,
      body,
      // author: req.user.id, // Attach the logged-in user’s ID as the author
      state: "draft", // Default state is draft
      read_count: 0,
      reading_time: calculateReadingTime(body),
    });

    await newBlog.save(); // Save the blog to the database
    res.status(201).json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    res.status(500).json({ message: "Error creating blog", error: error.message });
  }
};

// getuserblogs------------------------------------------------
const getUserBlogs = async (req, res) => {
  try {
      const { state, page = 1, limit = 10 } = req.query; // Pagination and filtering
      const filter = { author: req.user.id }; // Only fetch blogs created by the logged-in user

      // Validate state if provided
      if (state && !["draft", "published"].includes(state)) {
          return res.status(400).json({ message: "Invalid state value" });
      }

      if (state) {
          filter.state = state; // Filter by blog state (draft or published)
      }

      const totalBlogs = await Blog.countDocuments(filter); // Total count of user's blogs
      const totalPages = Math.ceil(totalBlogs / limit);

      if (page > totalPages) {
          return res.status(400).json({ message: "Page exceeds available data" });
      }

      const blogs = await Blog.find(filter)
          .sort({ timestamp: -1 }) // Sort blogs by newest first
          .skip((page - 1) * limit) // Pagination: skip appropriate number of items
          .limit(Number(limit)); // Limit the number of items per page

      if (blogs.length === 0) {
          return res.status(200).json({
              message: "No blogs found",
              totalBlogs: 0,
              totalPages,
              currentPage: Number(page),
              blogs: [],
          });
      }

      res.status(200).json({
          totalBlogs,
          totalPages,
          currentPage: Number(page),
          blogs,
      });
  } catch (error) {
      res.status(500).json({ message: "Error fetching your blogs", error: error.message });
  }
};

  
const editBlog = async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
  
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
  
      if (blog.author.toString() !== req.user.id) {
        return res.status(403).json({ message: "You are not authorized to edit this blog" });
      }
  
      const updates = req.body; // The updates sent in the request body
      Object.assign(blog, updates); // Update the blog fields with new values
      await blog.save();
  
      res.status(200).json({ message: "Blog updated successfully", blog });
    } catch (error) {
      res.status(500).json({ message: "Error editing blog", error: error.message });
    }
};

const deleteBlog = async (req, res) => {
  try {
    // Check if the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Check if the blog exists and if the user is authorized
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    
    // Check if the logged-in user is the author of the blog
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this blog" });
    }

    // Delete the blog
    await blog.remove();
    res.status(200).json({ message: "Blog deleted successfully" });

  } catch (error) {
    console.error(error);  // Log the error for debugging purposes
    res.status(500).json({ message: "Error deleting blog", error: error.message });
  }
};



const changeBlogState = async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
  
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
  
      if (blog.author.toString() !== req.user.id) {
        return res.status(403).json({ message: "You are not authorized to update this blog's state" });
      }
  
      blog.state = "published";
      await blog.save();
  
      res.status(200).json({ message: "Blog state updated to published", blog });
    } catch (error) {
      res.status(500).json({ message: "Error updating blog state", error: error.message });
    }
  };
  
module.exports = { createBlog, getUserBlogs, editBlog, deleteBlog, changeBlogState };