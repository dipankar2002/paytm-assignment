const zod = require('zod');

const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  imageUrl: zod.string(),
  password: zod.string()
})

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string()
})

const updateBody = zod.object({
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string()
})

module.exports = {
  signupBody,
  signinBody,
  updateBody
};