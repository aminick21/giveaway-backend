require("dotenv").config();
const _ = require("lodash");
const bcrypt = require('bcrypt');
const { User } = require("../models/userModel");
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET_KEY



function isValidEmail(email) {
  // Regular expression to validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

class AuthenticationController {

  async registerWithEmail(req, res) {
    const { email, password} = req.body;
     try {
        // validate email
        if (!email || typeof email !== 'string' || !isValidEmail(email)) {
          throw new Error('Invalid email address');
        }
        // Validate password
        if (!password || typeof password !== 'string' || password.length < 8) {
          throw new Error('Password must be at least 8 characters long');
        }
        
        // Check if the email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error('Email is already registered');
        }

         // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user
        const newUser = new User({
         email,
         password: hashedPassword,
          });
        await newUser.save();
 
        // Token generation
        const payload = { userId: newUser._id, email: newUser.email };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

      res.status(200).json({ message: 'User registered successfully', token });
     } catch (error) {
       res.status(500).json({ message: error.message});
     }
   }

  async loginWithEmail(req, res) {
    const { email, password } = req.body;

    try {

      // validate email
      if (!email || typeof email !== 'string' || !isValidEmail(email)) {
        throw new Error('Invalid email address');
      }
  
      // Validate password
      if (!password || typeof password !== 'string' || password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Check if user exists
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: 'Invalid email address' });
      }

      // Check if password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }
      // Generate JWT token

      // Token generation
      const payload = { userId: user._id, email: user.email };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
      res.status(200).json({ message: 'User Logged In  Successfully', token});

    } catch (error) {
      res.status(500).json({ message: error.message});
    }
  } 

  async registerProfile(req,res){
    try{
      const { name, phoneNumber, imagePath } = req.body;
      const userId= req.user.userId;
      console.log(userId)
      const user = await User.findOne({ _id: userId});
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      user.name=name;
      user.mobileNumber=phoneNumber;
      user.imageUrl=imagePath;
      await user.save();
      
      res.status(200).json({ success: true, message: 'Profile updated successfully'});
  
    }catch(err){
      console.error('Error updating profile:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }     
    }

}

module.exports = new AuthenticationController();

