// server/src/models/User.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    employeeId: { type: String, unique: true, sparse: true }, // UCUBE-1000, UCUBE-1001, etc.
    role: {
      type: String,
      enum: ['admin', 'employee'],
      default: 'employee'
    }
  },
  { timestamps: true }
);

// Counter schema for sequential ID generation
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

//  Generate sequential employeeId on first save
userSchema.pre('save', async function () {
  if (!this.employeeId) {
    try {
      // Use separate counters for employees and admins
      const counterName = this.role === 'admin' ? 'adminIdCounter' : 'employeeIdCounter';
      const counter = await Counter.findByIdAndUpdate(
        counterName,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      // Employees: UCUBE-1000, UCUBE-1001, ...
      // Admins: UCUBE-5000, UCUBE-5001, ...
      const baseNumber = this.role === 'admin' ? 5000 : 1000;
      this.employeeId = `UCUBE-${baseNumber + counter.seq}`;
    } catch (err) {
      console.error('Error generating employeeId:', err);
      throw err;
    }
  }

  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//  Compare password during login
userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

const User = mongoose.model('User', userSchema);
export { User as default, Counter };
