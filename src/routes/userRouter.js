const express = require("express");
const userRouter = express.Router();
const bodyParser = require('body-parser');
const userController = require("../controllers/userController");



userRouter.use(bodyParser.json());
userRouter.get("/getUserById/:userId", userController.getUserById);



module.exports = { userRouter };