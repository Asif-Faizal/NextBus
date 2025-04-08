import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UserController } from './controllers/user.controller';
import { authMiddleware } from './middlewares/auth.middleware';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin123@nextbus.ahsg094.mongodb.net/?retryWrites=true&w=majority&appName=NextBus';
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Initialize super admins
    const userController = new UserController();
    await userController.initializeSuperAdmins();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Routes
const userController = new UserController();

// Public routes
app.post('/api/auth/login', (req, res) => userController.login(req, res));

// Protected routes
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', userId: req.userId });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 