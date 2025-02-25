const express = require("express");
const http = require("http");
const app = express();
const db = require("./DBConnect");
const tokenValidator=require('./src/controllers/tokenValidator')

// firebase admin
const admin = require('firebase-admin');
const serviceAccount = require('./give-away-dfd3d-firebase-adminsdk-rc3kk-60b2ade78e.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const { productRouter } = require("./src/routes/productRouter");
const { authRouter } = require("./src/routes/authRouter");
const { chatRouter } = require("./src/routes/chatRouter");
const { categoryRouter } = require("./src/routes/categoryRouter");
const { userRouter } = require("./src/routes/userRouter");

const webSockets = require("./src/services/socketConnection");

app.use(express.json());

//db connection
db.connectDB();

// Define routes
app.use("/", productRouter);
app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/category", categoryRouter)
app.use("/user",  userRouter );

const PORT = 3000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
const io = require("socket.io")(server);
io.use(tokenValidator.validateSocketToken);
io.on('connection', (socket) => {
  webSockets.connection(io,socket);
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
