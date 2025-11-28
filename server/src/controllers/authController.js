import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log("Register endpoint hit!!", email, password, role);

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const user = await User.create({ email, password, role });
    console.log("USER CREATED:", user);  // <<< IMPORTANT CHECK

    const token = generateToken(user);
    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, role: user.role }
    });

  } catch (err) {
    console.log("REGISTER ERROR:", err);   // <<< THIS SHOWS THE REAL ISSUE
    return res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req, res) => {
  
  const { email, password } = req.body;
  console.log("Login endpoint hit"+email, password);
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = generateToken(user);
  res.json({
    token,
    user: { id: user._id, email: user.email, role: user.role }
  });
};
