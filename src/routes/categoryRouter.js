const express = require("express");
const categoryRouter = express.Router();
const categoryController = require("../controllers/categoryController");


categoryRouter.get("/getCategories", categoryController.getCategories);

// TODO: add validator 
categoryRouter.post("/addCategory", categoryController.addCategory);

module.exports = { categoryRouter };