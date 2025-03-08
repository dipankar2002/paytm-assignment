const express = require('express');
const authMiddleware = require('../middleware/middleware');
const { Account } = require('../db');
const { default: mongoose } = require('mongoose');
const router = express.Router();

router.post('/transfer', authMiddleware ,async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();
  const { amount, to } = req.body;
  const id = req.id;

  // Fetch the accounts within the transaction
  const account = await Account.findOne({ userId: id }).session(session);

  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficient balance",
      success: false
    });
  }

  const toAccount = await Account.findOne({ userId: to }).session(session);

  if (!toAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid account",
      success: false
    });
  }

  // Perform the transfer
  await Account.updateOne({ userId: id }, { $inc: { balance: -amount } }).session(session);
  await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

  // Commit the transaction
  await session.commitTransaction();
  res.json({
    message: "Transfer successful",
    success: true
  });
});

// ------------ This code by me \\ Which is bad way transactions -----------
// router.post('/transfer', authMiddleware ,async (req, res) => {
//   const { amount, to } = req.body;
//   const id = req.id;
//   const senderAccount = await Account.findOne({userId: id});
//   if(!senderAccount) {
//     return res.status(411).json({
//       message: "Sender account not found",
//     });
//   }
//   if(senderAccount.balance < amount) {
//     return res.status(411).json({
//       message: "Insufficient balance",
//     });
//   }
//   const receiverAccount = await Account.findOne({userId: to});
//   if(!receiverAccount) {
//     return res.status(411).json({
//       message: "Receiver account not found",
//     });
//   }
//   await Account.updateOne({userId:id},{
//     balance: senderAccount.balance - amount
//   })
//   await Account.updateOne({userId:to},{
//     balance: receiverAccount.balance + amount
//   })
//   res.status(200).json({
//     message: "Transfer successful"
//   });
// });

router.get('/balance', authMiddleware ,async (req, res) => {
  const id = req.id;
  const account = await Account.findOne({userId: id});
  if(!account) {
    return res.status(411).json({
      message: "Account not found",
      success: false
    });
  }
  
  res.status(200).json({
    data: {
      balance: account.balance
    },
    success: true
  });
});

module.exports = router;