const express = require('express');
const jwt = require('jsonwebtoken');
const userSchema = require('../zod/user');
const User = require('../db');
const router = express.Router();

router.post('/signin', async (req, res) => {
  const {username, password} = req.body;
  const userValidation = userSchema.safeParse({ username, password });

  if (!userValidation.success) {
    return res.status(411).json({
      message: "Incruct inputs"
    });
  }

  const findUser = await User.findOne({username: username});
  const token = jwt.sign({ id: findUser._id }, process.env.SECRET_KEY);
  if(findUser){
    res.status(200).json({
      token: token
    });
  }
  res.status(411).json({
    message: "Error while logging in"
  });
});

router.post('/signup', async (req, res) => {
  const { username, password, firstName, lastName } = req.body;
  const userValidation = userSchema.safeParse({ 
    username: username, 
    password: password, 
    firstName: firstName, 
    lastName: lastName
  });

  if (!userValidation.success) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs"
    });
  }

  const findUser = await User.findOne({username: username});
  if (findUser) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs"
    });
  } 

  const userData = await User.create({
    username: username,
    password: password,
    firstName: firstName,
    lastName: lastName
  });

  const token = jwt.sign({ id: userData._id }, process.env.SECRET_KEY);

  res.status(200).json({
    message: "User created successfully",
    token: token
  });
});

module.exports = router;