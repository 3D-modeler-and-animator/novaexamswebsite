require("dotenv").config();
const examRoutes = require("./routes/exam.routes");
const testimonialRoutes = require("./routes/testimonial.routes");
const blogRoutes = require("./routes/blogpost.routes");
const resourceRoutes = require("./routes/resource.routes");
const adminRoutes = require("./routes/admin.routes");
const teamRoutes = require("./routes/team.routes");

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

app.get("/", (req, res) => {
  res.send("Service is alive!");
});

const PORT = process.env.PORT || 5000;
const BACKEND_URL = process.env.BACKEND_URL;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  setInterval(() => {
    axios.get(BACKEND_URL)
      .then(() => console.log(`Pinged backend url to stay awake`))
      .catch(err => console.error("Ping failed:", err.message));
  }, 14 * 60 * 1000);
});
