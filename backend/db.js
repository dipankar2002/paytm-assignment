const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    minlength: 6,
    required: true
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: 50,
    required: true
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 50,
    required: true
  },
  imageUrl: {
    type: String,
    trim: true,
    required: true
  }
});

const acountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  balance: {
    type: Number,
    required: true
  }
});

const Account = mongoose.model('Account', acountSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
  User,
  Account
};