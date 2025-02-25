const { User } = require("../models/userModel");

class UserController{


async getUserById (req,res){
    try {
        const { userId } = req.params;
    
        // Validate if the userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ message: 'Invalid user ID' });
        }
    
        const user = await User.findById(userId); // Use findById to search by _id
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ message: error.message });
        }

}



}



module.exports = new UserController();