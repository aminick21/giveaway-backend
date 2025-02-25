const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, required: true },
});

// Create a new schema for the Room collection
const roomSchema = new mongoose.Schema({
  senderUid: { type: String, required: true },
  receiverUid: { type: String, required: true },
  roomId: { type: String, required: true },
});

// Create a model for the Room collection
const Room = mongoose.model('Room', roomSchema);
const Message = mongoose.model('Message', messageSchema);

module.exports = { Message ,Room };