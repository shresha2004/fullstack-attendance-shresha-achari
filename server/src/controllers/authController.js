import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log("Register endpoint hit!!", name, email, password, role);

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const user = await User.create({ name, email, password, role });
    console.log("USER CREATED:", user);

    const token = generateToken(user);
    res.status(201).json({
      token,
      user: { 
        id: user._id,
        name: user.name, 
        email: user.email, 
        employeeId: user.employeeId,
        role: user.role 
      }
    });

  } catch (err) {
    console.log("REGISTER ERROR:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { emailOrId, password } = req.body;
    console.log("Login endpoint hit with:", emailOrId);

    // Search by email or employeeId
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
      user: { 
        id: user._id,
        name: user.name, 
        email: user.email, 
        employeeId: user.employeeId,
        role: user.role 
      }
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};
