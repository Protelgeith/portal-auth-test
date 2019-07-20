const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  rfc: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
    match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
  },
  payroll: {
    type: String,
  },
  password: {
    type: String 
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  rol: {
    type: String,
  },
  activeUser: {
    type: Boolean, 
  },  
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  permissions : [
    [{
      _id: false,
      alta : Boolean,
      actualiza : Boolean,
      visualiza : Boolean,
    }],
    [{
      _id: false,
      alta : Boolean,
      actualiza : Boolean,
      visualiza : Boolean,
    }],
    [{
      _id: false,
      alta : Boolean,
      actualiza : Boolean,
      visualiza : Boolean,
    }],
    [{
      _id: false,
      alta : Boolean,
      actualiza : Boolean,
      visualiza : Boolean,
    }],
    [{
      _id: false,
      alta : Boolean,
      actualiza : Boolean,
      visualiza : Boolean,
    }],
    [{
      _id: false,
      alta : Boolean,
      actualiza : Boolean,
      visualiza : Boolean,
    }],
    [{
      _id: false,
      alta : Boolean,
      actualiza : Boolean,
      visualiza : Boolean,
    }],
    [{
      _id: false,
      alta : Boolean,
      actualiza : Boolean,
      visualiza : Boolean,
    }],
  ],
  fullForm: { type: Boolean, default: false },
}, {
  versionKey: false,
  collection: 'User'
});


module.exports = mongoose.model('User', UserSchema);
