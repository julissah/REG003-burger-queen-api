const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = Schema({
    // __v: { type: Number, select: false },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      admin: {
        type: Boolean,
        default: false,
      },
    },
})

UserSchema.pre('save', (next) => {
  const user = this;
  
  if(!user.isModified('password')) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, null, (err, hash) =>{
      if (err) return next(err)
      user.password = hash
      next();
    });
  });



});

UserSchema.methods.comparePassword = async (password, dbPassword) => {
  try {
    const match = await bcrypt.compare(password, dbPassword);
    if (!match) {
      throw new Error('Authentication error');
    }
    return match;
  } catch (error) {
    throw new Error('Wrong password.');
  }
};

module.exports = mongoose.model('User', UserSchema)
