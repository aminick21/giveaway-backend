const express = require("express");
const authRouter = express.Router();
const bodyParser = require('body-parser');
const authController = require('../controllers/authController');
const tokenValidator=require('../controllers/tokenValidator')



authRouter.use(bodyParser.json());

authRouter.post('/registerWithEmail', authController.registerWithEmail);
authRouter.post('/loginWithEmail',authController.loginWithEmail);
authRouter.post('/registerProfile', tokenValidator.validateToken,authController.registerProfile);


module.exports = { authRouter };

