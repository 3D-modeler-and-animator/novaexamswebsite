const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogpost.controller");
const authenticateAdmin = require("../middleware/authAdmin");

router.post("/", authenticateAdmin, blogController.createBlogPost);
router.get("/", blogController.getBlogPosts);
router.get("/:id", blogController.getBlogPost);
router.patch("/:id", authenticateAdmin, blogController.updateBlogPost);
router.delete("/:id", authenticateAdmin, blogController.deleteBlogPost);

module.exports = router;
