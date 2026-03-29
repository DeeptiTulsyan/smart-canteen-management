const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// routes
const orderRoutes = require("./routes/orderRoutes");
app.use("/orders", orderRoutes);

// DB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Order Service DB Connected"))
.catch(err => console.log(err));

// Server
app.listen(process.env.PORT, () => {
  console.log(`Order Service running on ${process.env.PORT}`);
});