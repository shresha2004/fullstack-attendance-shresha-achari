import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import debugRoutes from './routes/debugRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000 ;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
const corsOptions = {
  //Frontend (Deployed URL)
  // origin: 'https://fullstack-attendance-shresha-achari.vercel.app',


   //For local machine
  origin: 'http://localhost:5173',

  //Docker URL
 // origin: 'http://localhost:3000',
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
async function connectDatabase() {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(MONGO_URI);
      console.log('Database connected');
    } catch (err) {
      console.error('Database connection error:', err);
      if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
      }
    }
  }
}

connectDatabase();

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('MongoDB connection established');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/debug', debugRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running', status: 'ok' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.render('index');
});

// Favicon
app.get('/favicon.ico', (req, res) => res.status(204));

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server (for local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT,"0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
export default app;
