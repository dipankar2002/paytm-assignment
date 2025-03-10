const express = require('express');
const jwt = require('jsonwebtoken');
const { signupBody, signinBody, updateBody } = require('../zod/user');
const { User, Account} = require('../db');
const authMiddleware = require('../middleware/middleware');
const { hashPassword, comparePassword } = require('../middleware/hashPass');
const router = express.Router();

router.put('/update', authMiddleware ,async (req, res) => {
  const { username, password, firstName, lastName } = req.body;
  const id = req.id;

  const userValidation = updateBody.safeParse({ username, password, firstName, lastName });
  if(!userValidation.success) {
    return res.status(411).json({
      message: "Error while updating information",
      success: false
    });
  }

  const oldUser = User.findOne({_id: id});

  await User.updateOne({_id: id}, {
    username: username? username : oldUser.username,
    password: password? password : oldUser.password,
    firstName: firstName? firstName : oldUser.firstName,
    lastName: lastName? lastName : oldUser.lastName
  })
  res.status(200).json({
    message: "User information updated successfully",
    success: true
  });
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";
  
  if(filter) {
    const users = await User.find({
      $or: [{
        firstName: {
          "$regex": filter
        }
      }, {
        lastName: {
          "$regex": filter
        }
      }]
    })
    return res.status(200).json({
      data: users.map(user => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        _id: user._id
      })),
      success: true
    })
  }
  const usersAll = await User.find();
  res.status(200).json({
    data: usersAll.map(user => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      _id: user._id
    })),
    success: true
  });
})

// ------------ This code by me -----------
// async function findKey(value) {
//   const user = await User.findOne();
//   if(!user) {
//     return null;
//   }
//   for (const key in user.toObject()) {
//     if (user[key] === value) {
//       console.log(`Found! Key: ${key}, Value: ${value}`);
//       return key;
//     }
//   }
//   return null;
// }
// router.get('/bulk', authMiddleware, async (req, res) => {
//   const filter = req.query.filter;
//   const id = req.id;

//   const key = findKey(filter);

//   if(filter && key) {
//     const filterUser = await User.findOne({key: filter});
//     return res.status(200).json(filterUser);
//   }

//   const user = await User.findOne({_id: id});
//   res.status(200).json(user);
// });

router.post('/currentUser', authMiddleware, async (req, res) => {
  const id = req.id;
  const user = await User.findOne({_id: id});
  
  if(!user) {
    return res.status(411).json({
      message: "User not found",
      success: false
    });
  }
  res.status(200).json({
    data: {
      _id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl
    },
    success: true
  });
});

router.post('/signin', async (req, res) => {
  const {username, password} = req.body;
  const userValidation = signinBody.safeParse({ 
    username: username, 
    password: password
  });
  
  if (!userValidation.success) {
    return res.status(411).json({
      message: "Incruct inputs",
      success: false
    });
  }
  
  const findUser = await User.findOne({username: username});
  if(!findUser) {
    return res.status(411).json({ 
      message: "User does not exists",
      success: false
    });
  }

  const matchPassword = await comparePassword(password,findUser.password);

  if(!matchPassword) {
    return res.status(411).json({ 
      message: "Wrong Password",
      success: false
    });
  }

  if(matchPassword){
    const token = jwt.sign({ id: findUser._id }, process.env.SECRET_KEY);
    return res.status(200).json({
      token: token,
      success: true
    });
  }
  res.status(411).json({
    message: "Error while logging in",
    success: false
  });
});

router.post('/signup', async (req, res) => {
  const { username, password, firstName, lastName } = req.body;
  const imageUrl = `https://i.pravatar.cc/48?u=${Date.now()}`;
  
  
  const userValidation = signupBody.safeParse({ 
    username: username,
    password: password,
    firstName: firstName,
    lastName: lastName,
    imageUrl: imageUrl
  });

  if (!userValidation.success) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
      success: false
    });
  }

  const findUser = await User.findOne({username: username});
  if (findUser) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
      success: false
    });
  } 

  const hashedPassword = await hashPassword(password);

  const userData = await User.create({
    username: username,
    password: hashedPassword,
    firstName: firstName,
    lastName: lastName,
    imageUrl: imageUrl
  });

  await Account.create({
    userId: userData._id,
    balance: (Math.random() * 10000 + 1).toFixed(2)
  })

  const token = jwt.sign({ id: userData._id }, process.env.SECRET_KEY);

  res.status(200).json({
    message: "User created successfully",
    token: token,
    success: true
  });
});

module.exports = router;