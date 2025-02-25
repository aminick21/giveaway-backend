const mgs = require("mongoose");
require("dotenv").config();
const dbPassword = process.env.DB_PASSWORD;

const connectDB = async () => {
  try {
    await mgs.connect(
      `mongodb+srv://sakuna:${dbPassword}@giveawaycluster.jbb1vjg.mongodb.net`
    );

    console.log(`DB is connected with ${mgs.connection.host}`);
  } catch (err) {
    console.error("An Error occurred: ", err.message);
  }
};

const closeDBConnection = async () => {
  try {
    await mgs.disconnect().then(() => {
      console.log("Disconnected successfully");
    });
  } catch (err) {
    console.error("Erorr occurred while disconnecting: ", err.message);
  }
};

module.exports = {
  connectDB,
  closeDBConnection,
};
