const express = require('express');
const jwt = require('jsonwebtoken');
const userSchema = require('../zod/user');
const User = require('../db');
const authMiddleware = require('../middleware/middleware');
const router = express.Router();

router.put('/', authMiddleware ,async (req, res) => {
  const { password, firstName, lastName } = req.body;
  const id = req.id;

  const userValidation = userSchema.safeParse({ password, firstName, lastName });
  if(!userValidation.success) {
    return res.status(411).json({
      message: "Error while updating information"
    });
  }

  const oldUser = User.findOne({_id: id});

  const updateUser = await User.findOneAndUpdate({_id: id}, {
    password: password? password: oldUser.password,
    firstName: firstName? firstName: oldUser.firstName,
    lastName: lastName? lastName: oldUser.lastName
  })
  console.log(updateUser);
  res.status(200).json({
    message: "User information updated successfully"
  });
});

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
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
  }
  const user = await User.find();
  res.status(200).json(user);
})

// ------------ This code by me -----------
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