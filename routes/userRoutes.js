const express = require("express");

const router = express.Router();

const User = require("../models/user");
const { jwtAuthMiddleware, generateToken } = require("../jwt");

// * Save the new user to the database with await and async
router.post("/signup", async (req, res) => {
  try {
    const data = req.body; // Assuming the request body contains the user data
    const newUser = new User(data); // Create a new User document using the Mongoose model
    const response = await newUser.save(); // Save the new user to the database
    
    const payload = {
      id: response.id,
    }
    console.log("payload : ",JSON.stringify(payload));

    const token = generateToken(payload);
    console.log("data saved");

    
    console.log("Token is : ", token);
    res.status(200).json({response: response, token: token});
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login Route
router.post('/login', async(req, res) => {
  try{
      // Extract aadharCardNumber and password from request body
      const {aadharCardNumber, password} = req.body;

      // Find the user by aadharCardNumber
      const user = await User.findOne({aadharCardNumber: aadharCardNumber});

      // If user does not exist or password does not match, return error
      if( !user || !(await user.comparePassword(password))){
          return res.status(401).json({error: 'Invalid username or password'});
      }

      // generate Token 
      const payload = {
          id: user.id,
          username: user.username
      }
      const token = generateToken(payload);

      // resturn token as response
      res.json({token})
  }catch(err){
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
  try{
      const userData = req.user;
      const userId = userData.id;
      const user = await User.findById(userId);
      res.status(200).json({user});
  }catch(err){
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
})

// Update Profile route
router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Extract the id from the Token
    const {currentPassword, newPassword}= req.body; // Extract current and new passwords from request body

    // Find the user by userId
    const user = await User.findById(userId);

    // If password does not match, return error
    if(!(await comparePassword(currentPassword, newPassword))) 
      return res.status(401).json({error: "Invalid username or password"}); 
    
    // Update the user's password
    user.password = newPassword;
    await user.save();

    console.log("Password Updated");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
