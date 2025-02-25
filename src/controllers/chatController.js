const { Message , Room } = require('../models/chatModel');
const {User} = require('../models/userModel');
const mongoose = require('mongoose');

class ChatController {

  async joinOrCreateRoom(senderUid, receiverUid) {
    // Try to find the roomId with sender as senderUid and receiver as receiverUid
    let roomData = await Room.findOne({ senderUid, receiverUid });

    // If not found, try to find the roomId with sender as receiverUid and receiver as senderUid
    if (!roomData) {
      roomData = await Room.findOne({ senderUid: receiverUid, receiverUid: senderUid });
    }

    let roomId = roomData ? roomData.roomId : null;

    // If roomId doesn't exist, create a new room
    if (!roomId) {
      // Generate a unique roomId (you can use any logic to generate a unique identifier)
      roomId = `${senderUid}-${receiverUid}`;

      // Save the new room to the Room collection
      await Room.create({
        senderUid,
        receiverUid,
        roomId,
      });
    }

    return roomId;
  }

  async saveMessage(senderUid, receiverUid, content,status) {
    try {
      // Save the new message to the database
      const message = new Message({
        _id: new mongoose.Types.ObjectId(),
        senderId: senderUid,
        receiverId: receiverUid,
        message: content,
        status: status
      });
      await message.save();
      return message;
    } catch (error) {
      console.error('Error saving message:', error);
      throw error; 
    }
  }
  
  async getMessages(req, res){
    try {
      const { senderId, receiverId,page,limit } = req.query;
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);

      // Calculate the number of documents to skip
      const skip = (pageNum - 1) * limit;

      // Fetch messages from the database based on sender and receiver IDs
      const oldMessages = await Message.find({
        $or: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      }).sort({ timestamp: -1 }) 
      .skip(skip)
      .limit(parseInt(limitNum, 10));
  
      // Send the old messages as a response
      res.status(200).json({  messages: oldMessages });
    } catch (error) {
      console.error('Error fetching old messages:', error);
      res.status(500).json({  error: 'Internal Server Error' });
    }
  }

  async getChatList(req,res){
    try {
      const userId = req.user.userId;

    // Fetch rooms the user is part of
      const rooms = await Room.find({
        $or: [{ senderUid: userId }, { receiverUid: userId }],
      });

      const chatList = await Promise.all(
        rooms.map(async (room) => {
          // Determine the other user's UID
          const otherUserId = room.senderUid === userId ? room.receiverUid : room.senderUid;
  
          // Fetch the other user's details
          const otherUser = await User.findOne({ _id: otherUserId });
  
          // Fetch messages between the users in the room with status 'delivered'
          const messages = await Message.find({
            $or: [
              { senderId: userId, receiverId: otherUserId,status: 'delivered'  },
              { senderId: otherUserId, receiverId:userId,status: 'delivered' },
            ],
          }).sort({ timestamp: -1 });
  
          return {
            user: otherUser,
            messages:messages,
          };
        })
      );
      
      res.status(200).json(chatList);
      
    } catch (error) {
      console.error('Error fetching old messages:', error);
      res.status(500).json({  error: 'Internal Server Error' });
    }
  }


}

module.exports = new ChatController();
