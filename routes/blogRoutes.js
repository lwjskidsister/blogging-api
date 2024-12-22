const authenticate = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const { createBlog, getUserBlogs, editBlog } = require("../controllers/blogController");
const { deleteBlog, changeBlogState } = require("../controllers/blogController");

router.post("/", authenticate, createBlog); // Only logged-in users can create blogs
router.get("/blogs/mine", authenticate, getUserBlogs);
router.put("/blogs/:id", authenticate, editBlog); // Only the owner users can edit blogs
router.delete("/blogs/:id", authenticate, deleteBlog); // Only owner can delete blogs
router.patch("/blogs/:id/state", authenticate, changeBlogState); // Only the owner can change the state

module.exports = router;