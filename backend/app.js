const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const historyRoutes = require("./routes/historyRoutes");
const predictRoutes = require("./routes/predictRoutes");


const app = express();

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes); 
app.use("/api/predict", predictRoutes);


module.exports = app;
