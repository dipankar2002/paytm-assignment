const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL);

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