const Product = require("../models/product");

// Tester
const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({ price: { $gt: 30 } })
    .sort("price")
    .select("name price")
    .limit(7);
  res.status(200).json({ products, nbHits: products.length });
};
const getAllProducts = async (req, res) => {
  // Pulling out the properties that you want to apply to the find / search query
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  // What we are storing inside
  const queryObject = {};
  // If featured is true we can send this to the Product.find()
  // --> If the property is actually coming in with a request
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  // If the company exists
  if (company) {
    // Show the company the user has selected --> i.e Only show Ikea if they click "Ikea"
    queryObject.company = company;
  }
  // If the name exists
  if (name) {
    // Show only the name the user has searched for
    queryObject.name = {
      // This just narrows our search down to what we write
      // i.e if we type in e --> we will only see results that have "e" in their name
      $regex: name,
      // i = case insensisitve
      $options: "i",
    };
  }
  if (numericFilters) {
    const operatorMap = {
      // Binding the ">" sign to gt ---> GREATER THAN
      ">": "gt",
      // Binding it to GREATER THAN OR EQUALS
      ">=": "gte",
      // Binding it to EQUALS
      "=": "gt",
      // Binding it to LESS THAN
      "<": "lt",
      // Binding it to LESS THAN OR EQUALS
      "<=": "lte",
    };
    // Regular Expression
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    // Second parameter is a callback function IF THERE IS A MATCH
    let filters = numericFilters.replace(
      regEx,
      // If there is a match, display it in this format
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
    console.log(filters);
  }

  console.log(queryObject);
  // Sorting the data by the parameters the User chooses
  let result = Product.find(queryObject);
  if (sort) {
    // This splits the parameters up so you can use 2 or more in one search --> To sort them
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createAt");
  }
  // Fields shows only the parameters we choose
  // i.e Searching for name and price will only show those two (and the id of course)
  if (fields) {
    // This splits the parameters up so you can use 2 or more in one search --> To sort them
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }
  // Changes the page number from string to number || Or Start them on page 1
  const page = Number(req.query.page) || 1;
  // Limits how many results show || If no amount is selected --> Show 10 as Default
  const limit = Number(req.query.limit) || 10;
  // Skips a page if the user wants to
  const skip = (page - 1) * limit;

  // Chaining the parameters into the result (same as destructuring in the req.query above)
  // If we choose to skip a page
  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
