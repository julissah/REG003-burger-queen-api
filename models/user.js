const { mongoose, Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    // __v: { type: Number, select: false },
    id: { type: Number, select: false},
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
  console.log(user);
  if(!user.isModified('password')) return next();

  // bcrypt.genSalt(10, (err, salt) => {
    // if (err) return next(err)

    bcrypt.hash(user.password, 10, (err, hash) =>{
      if (err) return next(err)
      user.password = hash
      next();
    });
  // });

});

UserSchema.pre('findOneAndUpdate', (next) => {
  const user = this;
  if (!user._update.$set.password) return next();
  bcrypt.hash(user._update.$set.password, 10, (err, passwordHash) => {
    if (err) return next(err);
    user._update.$set.password = passwordHash;
    next();
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

module.exports = model('User', UserSchema)
