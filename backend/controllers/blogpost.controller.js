const prisma = require("../prisma/client");

exports.createBlogPost = async (req, res) => {
  try {
    const blogPost = await prisma.blogPost.create({
      data: {
        title: req.body.title,
        excerpt: req.body.excerpt,
        category: req.body.category,
        author: req.body.author,
        date: req.body.date ? new Date(req.body.date) : new Date(),
        readTime: req.body.readTime || null,
      },
    });
    res.status(201).json({ success: true, message: "Blog post created successfully", data: blogPost });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create blog post", error: error.message });
  }
};

exports.getBlogPosts = async (req, res) => {
  try {
    const blogPosts = await prisma.blogPost.findMany({ orderBy: { date: "desc" } });
    res.json({ success: true, message: "Blog posts fetched successfully", data: blogPosts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch blog posts", error: error.message });
  }
};

exports.getBlogPost = async (req, res) => {
  try {
    const blogPost = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
    if (!blogPost) return res.status(404).json({ success: false, message: "Blog post not found" });
    res.json({ success: true, message: "Blog post fetched successfully", data: blogPost });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch blog post", error: error.message });
  }
};

exports.updateBlogPost = async (req, res) => {
  try {
    const blogPost = await prisma.blogPost.update({
      where: { id: req.params.id },
      data: {
        title: req.body.title,
        excerpt: req.body.excerpt,
        category: req.body.category,
        author: req.body.author,
        date: req.body.date ? new Date(req.body.date) : undefined,
        readTime: req.body.readTime || null,
      },
    });
    res.json({ success: true, message: "Blog post updated successfully", data: blogPost });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update blog post", error: error.message });
  }
};

exports.deleteBlogPost = async (req, res) => {
  try {
    await prisma.blogPost.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Blog post deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete blog post", error: error.message });
  }
};


exports.getBlogPosts = async (req, res) => {
  try {
    const blogPosts = await prisma.blogPost.findMany({
      orderBy: { date: "desc" },
    });
    res.json({
      success: true,
      message: "Blog posts fetched successfully",
      data: blogPosts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog posts",
      error: error.message,
    });
  }
};

exports.getBlogPost = async (req, res) => {
  try {
    const blogPost = await prisma.blogPost.findUnique({
      where: { id: req.params.id },
    });

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    res.json({
      success: true,
      message: "Blog post fetched successfully",
      data: blogPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog post",
      error: error.message,
    });
  }
};

exports.updateBlogPost = async (req, res) => {
  try {
    let imageUrl = undefined;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype, "nova-exams/blogs", req.file.originalname);
      imageUrl = result.secure_url;
    } else if (req.body.imageUrl !== undefined) {
      imageUrl = req.body.imageUrl;
    }

    const data = {
      title: req.body.title,
      excerpt: req.body.excerpt,
      category: req.body.category,
      author: req.body.author,
      date: req.body.date ? new Date(req.body.date) : undefined,
      readTime: req.body.readTime || null,
    };

    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (req.body.imagePosition) data.imagePosition = req.body.imagePosition;

    const blogPost = await prisma.blogPost.update({
      where: { id: req.params.id },
      data,
    });

    res.json({ success: true, message: "Blog post updated successfully", data: blogPost });
  } catch (error) {
    console.error("updateBlogPost error:", error.message);
    res.status(500).json({ success: false, message: "Failed to update blog post", error: error.message });
  }
};

exports.deleteBlogPost = async (req, res) => {
  try {
    await prisma.blogPost.delete({ where: { id: req.params.id } });
    res.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete blog post",
      error: error.message,
    });
  }
};
