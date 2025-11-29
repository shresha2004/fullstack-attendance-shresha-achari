import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    employeeId: { type: String, unique: true, sparse: true },
    role: {
      type: String,
      enum: ['admin', 'employee'],
      default: 'employee'
    }
  },
  { timestamps: true }
);

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

userSchema.pre('save', async function () {
  if (!this.employeeId) {
    try {
      const counterName = this.role === 'admin' ? 'adminIdCounter' : 'employeeIdCounter';
      const counter = await Counter.findByIdAndUpdate(
        counterName,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      const baseNumber = this.role === 'admin' ? 5000 : 1000;
      this.employeeId = `UCUBE-${baseNumber + counter.seq}`;
    } catch (error) {
      throw error;
    }
  }

  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

const User = mongoose.model('User', userSchema);
export { User as default, Counter };
