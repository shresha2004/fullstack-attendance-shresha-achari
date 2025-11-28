import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import debugRoutes from './routes/debugRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Set EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// ⭐ Place this BEFORE other middlewares
app.get("/", (req, res) => {
  res.render("index");
});


// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/debug', debugRoutes);

// Error Middlewares MUST be last
app.use(notFound);
app.use(errorHandler);

export default app;
