const mongoose = require('mongoose');
const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/paytm-assignment';

mongoose.connect(mongoUrl);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
})

const User = mongoose.model('User', userSchema);

module.exports = User;