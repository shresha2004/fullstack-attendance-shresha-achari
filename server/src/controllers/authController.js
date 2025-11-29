import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  employeeId: user.employeeId,
  role: user.role
});

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = await User.create({ name, email, password, role });
    const token = generateToken(user);

    res.status(201).json({
      token,
      user: formatUserResponse(user)
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { emailOrId, password } = req.body;

    const user = await User.findOne({
      $or: [
        { email: emailOrId.toLowerCase() },
        { employeeId: emailOrId.toUpperCase() }
      ]
    });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: formatUserResponse(user)
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
};
