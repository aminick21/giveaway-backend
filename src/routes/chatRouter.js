const express = require('express');
const chatRouter = express.Router();
const bodyParser = require('body-parser');
const chatController = require('../controllers/chatController');
const tokenValidator=require('../controllers/tokenValidator')
chatRouter.use(bodyParser.json());

// Route to fetch old messages
chatRouter.get('/getMessages',tokenValidator.validateToken, chatController.getMessages);
chatRouter.get('/getChatList',tokenValidator.validateToken, chatController.getChatList);

module.exports = { chatRouter };
