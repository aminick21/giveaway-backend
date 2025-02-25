const express = require("express");
const productRouter = express.Router();
const productController = require("../controllers/productController");
const tokenValidator=require('../controllers/tokenValidator')
const bodyParser = require('body-parser');


productRouter.use(bodyParser.json());

productRouter.get("/", productController.getAllProducts);
productRouter.post("/productById",  productController.getProductById);
productRouter.get("/productList",productController.productList);

productRouter.get("/recentlyAddedProducts", productController.getRecentlyAddedProducts);

productRouter.post("/addProduct",tokenValidator.validateToken, productController.addProduct);

module.exports = { productRouter };
