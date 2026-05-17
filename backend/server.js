require("dotenv").config();
const examRoutes = require("./routes/exam.routes");
const testimonialRoutes = require("./routes/testimonial.routes");
const blogRoutes = require("./routes/blogpost.routes");
const resourceRoutes = require("./routes/resource.routes");
const adminRoutes = require("./routes/admin.routes");
const teamRoutes = require("./routes/team.routes");
const prisma = require("./prisma/client");

const allowedOrigins = [
  process.env.FRONTEND_URL,      
  "http://localhost:3000"
];

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const axios = require("axios"); 

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin) ||
      /^https:\/\/(\w+\.)?novaexams\.com$/.test(origin) 
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use("/api/exams", examRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/team", teamRoutes);

// Groq AI chat proxy
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array required" });
    }
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages,
        temperature: 0.7,
        max_tokens: 300,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );
    res.json({ reply: response.data.choices[0].message.content });
  } catch (err) {
    console.error("Groq error:", err?.response?.data || err.message);
    res.status(500).json({ error: "AI service unavailable" });
  }
});

app.get("/", (req, res) => {
  res.send("Service is alive!");
});

async function ensureBlogColumns() {
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "imagePosition" TEXT DEFAULT 'top'`);
    console.log("BlogPost columns ensured.");
  } catch (err) {
    console.error("Column migration error:", err.message);
  }
}

const PORT = process.env.PORT || 5000;
const BACKEND_URL = process.env.BACKEND_URL; 

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await ensureBlogColumns();

  setInterval(() => {
    axios.get(BACKEND_URL)
      .then(() => console.log(`Pinged backend url to stay awake`))
      .catch(err => console.error("Ping failed:", err.message));
  }, 14 * 60 * 1000);
});
