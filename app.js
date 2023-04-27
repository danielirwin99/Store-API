require("dotenv").config();
// Async Errors
require("express-async-errors");

// Our Express Framework
const express = require("express");
const app = express();

// Invoking our MongoDB Atlas Connection
const connectDB = require("./db/connect");

// Importing our product routes --> From routes folder
const productsRouter = require("./routes/products");

// Our Error Middleware
const notFoundMiddleware = require("../starter/middleware/not-found");
const errorFoundMiddleware = require("../starter/middleware/error-handler");

// Json Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send('<h1>Store API</h1> <a href="/api/v1/products">Products</a> ');
});

// Router
app.use("/api/v1/products", productsRouter);

// Products Route
app.use(notFoundMiddleware);
app.use(errorFoundMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    // Connect DB from MongoDB
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening to the port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
