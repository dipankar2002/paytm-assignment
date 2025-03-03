const zod = require('zod');

const userSchema = zod.object({
  username: zod.string().email(),
  password: zod.string().min(6).max(16),
  firstName: zod.string().min(1),
  lastName: zod.string().min(1)
});

module.exports = userSchema;