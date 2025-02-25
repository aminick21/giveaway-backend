const _ = require("lodash");
const {
  Product,
  Location,
} = require("../models/productModel");
const { User } = require("../models/userModel");
const productUtils = require("../utils/productUtils");


class ProductController{

  async addProduct(req, res) {
    try {
      const uid = req.user.userId;
      const {
        title,
        category,
        productAge,
        condition,
        productDescription,
        imageUrl,
        addressLine,
        city,
        state,
        pinCode,
        lat,
        long
      } = req.body;
  
      // Create and save the location
      const newLocation = new Location({
        addressLine: addressLine,
        city: city,
        state: state,
        pinCode: pinCode,
        lat: lat,
        long: long,
      });
  
      const savedLocation = await newLocation.save();
  
      // Create and save the product with the location reference
      const newProduct = new Product({
        userId: uid,
        title: title,
        category: category,
        productAge: productAge,
        imageUrl: imageUrl,
        condition: condition,
        productDescription: productDescription,
        location: savedLocation._id,
      });
  
      await newProduct.save();
  
      // Send response after both location and product are saved
      res.status(200).json({
        message: "Product Added Successfully!!",
      });
    } catch (error) {
      console.log(error)
      res.status(400).json({ message: error.message });
    }
  }
  
  async getRecentlyAddedProducts(req,res) {
    try {

      const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(10) 
      .populate('location') 
      .exec();

    res.status(200).json({Products : recentProducts});
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message });
    }


  }

   getAllProducts = async (req, res) => {
    try {
    
      const products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(10) 
      .populate('location') 
      .exec();

    res.status(200).json({Products : products});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
   getProductById = async (req, res) => {
    const { productId } = req.body;
  
    if (_.isUndefined(productId)) {
      res.status(400).json({ message: "productId not provided" });
    }
    try {
      // Convert the productId string to a valid ObjectId
      // const objectId = new mongoose.Types.ObjectId(productId);
      const product = await Product.findById({ _id: productId })
        .populate("productDescription")
        .populate("location");
  
      if (!product) {
        res.status(400).json({ message: "Product not found" });
      }
      res.status(200).json({ productId: productId, result: product });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  updateProduct = async (req, res) => {};
  
  deleteProduct = async (req, res) => {};
  

async productList (req, res){
  try {
    const { category, search, minAge, maxAge, condition, page = 1, limit = 10 } = req.query;

    // Construct the query object
    let query = {};
    console.log(req);
    if (category) query.category = category;
    if (search) query.$or = [{ title: new RegExp(search, 'i') }, { productDescription: new RegExp(search, 'i') }];
    if (minAge || maxAge) query.productAge = { ...(minAge && { $gte: minAge }), ...(maxAge && { $lte: maxAge }) };
    if (condition) query.condition = condition;

    // Fetch products with pagination
    const products = await Product.find(query)
      .populate('location') 
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .exec();

    // Count total number of documents that match the query
    const count = await Product.countDocuments(query);

    // Send response
    res.status(200).json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

}


module.exports = new ProductController();

