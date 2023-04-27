require("dotenv").config();
const connectDB = require("./db/connect");
const Product = require("./models/product");
// All our Products
const jsonProducts = require("./products.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Product.deleteMany();
    // This imports the json products into the MongoDB 
    await Product.create(jsonProducts);
    // Checks to see if node populate ran sucessfully
    console.log("Success");
    process.exit(0)
  } catch (error) {
    console.log(error);
    process.exit(1)
  }
};

start();
