const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    __v: { type: Number, select: false },
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

module.exports = mongoose.model('User', UserSchema)

