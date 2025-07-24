import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true
  },
  nameOfLocation: {
    type: String,
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  loginHour: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female'],
    index: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  brandDevice: {
    type: String,
    required: true,
    index: true
  },
  digitalInterest: {
    type: String,
    required: true,
    index: true
  },
  locationType: {
    type: String,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;