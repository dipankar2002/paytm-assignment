const express = require('express');
const authMiddleware = require('../middleware/middleware');
const { Account } = require('../db');
const router = express.Router();

router.post('/transfer', authMiddleware ,async (req, res) => {
  const { amount, to } = req.body;
  const id = req.id;
  const senderAccount = await Account.findOne({userId: id});
  if(!senderAccount) {
    return res.status(411).json({
      message: "Sender account not found",
    });
  }
  if(senderAccount.balance < amount) {
    return res.status(411).json({
      message: "Insufficient balance",
    });
  }
  const receiverAccount = await Account.findOne({userId: to});
  if(!receiverAccount) {
    return res.status(411).json({
      message: "Receiver account not found",
    });
  }
  await Account.updateOne({userId:id},{
    balance: senderAccount.balance - amount
  })
  await Account.updateOne({userId:to},{
    balance: receiverAccount.balance + amount
  })
  res.status(200).json({
    message: "Transfer successful"
  });
});

router.get('/balance', authMiddleware ,async (req, res) => {
  const id = req.id;
  const account = await Account.findOne({userId: id});
  if(!account) {
    return res.status(411).json({
      message: "Account not found",
    });
  }
  
  res.status(200).json({
    balance: account.balance
  });
});

module.exports = router;