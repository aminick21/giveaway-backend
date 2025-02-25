
const { Category } = require("../models/categoryModel");

class CategoryController{

    async getCategories(req, res){
        try {
            const categories = await Category.find();
            res.status(200).json(categories);
          } 
          catch (error) {
            res.status(500).json({ message: error.message });
          }

    }

    async addCategory(req, res){
        try {
          const { name, image } = req.body;
          const category = new Category({ name, image });
          await category.save();
          res.status(201).json(category);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }


}


module.exports = new CategoryController();