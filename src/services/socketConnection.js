const { Message, Room } = require("../models/chatModel");
const ChatController = require("../controllers/chatController");

//importing modules
class WebSockets {
  userSocketMap = new Map();
  pendingMessages = new Map(); 

  connection(io, socket) {
    console.log("A client connected with socket id:",socket.id,", Email -", socket.decoded.email);

    socket.on('register',async(data) =>{
      const userId = socket.decoded.userId

      // log user
      this.userSocketMap.set(userId, socket.id);
      console.log(this.userSocketMap)

      // fetch pending messages
      if (this.pendingMessages.has(userId)) {
        const messages = this.pendingMessages.get(userId);
        messages.forEach(async (message) => {
          // Send each pending message
          console.log('sending message')
          io.to(socket.id).emit('newMessage2', {content:message['content']})
        });
        // Remove pending messages after sending
        this.pendingMessages.delete(userId);
      }

      // update connection status 

    }
    )

    socket.on('sendMessage', async (data)=>{
      const { id,from, to, content,timeStamp } = data;
      console.log(data)
      // check if connected 
      const receiverSocketId = this.userSocketMap.get(to);
      if(receiverSocketId){
        io.to(receiverSocketId).emit('newMessage', { id,from, to, content,timeStamp })
      }
      else{
        // store message in Q
        if (!this.pendingMessages.has(to)) {
          this.pendingMessages.set(to, []);
        }
        this.pendingMessages.get(to).push({ id,from, to, content,timeStamp });
        console.log(`Message for User ${to} stored temporarily:`, { from, content });
      }
  }
  );



    socket.on("disconnect", () => {
      const userId = socket.decoded.userId
      console.log("User disconnected");
      console.log("connection closed");
      this.userSocketMap.delete(userId);
      console.log(this.userSocketMap);
    });


  }


  
}

module.exports = new WebSockets();

