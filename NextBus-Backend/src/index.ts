import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UserController } from './controllers/user.controller';
import { BusController } from './controllers/bus.controller';
import { RouteController } from './controllers/route.controller';
import { StopController } from './controllers/stop.controller';
import { AdController } from './controllers/ad.controller';
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

// Controllers
const userController = new UserController();
const busController = new BusController();
const routeController = new RouteController();
const stopController = new StopController();
const adController = new AdController();

// Public routes
app.post('/api/auth/login', (req, res) => userController.login(req, res));
app.post('/api/auth/refresh-token', (req, res) => userController.refreshToken(req, res));

// Protected routes
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', userId: req.userId });
});

// Bus routes
app.get('/api/buses', authMiddleware, (req, res) => busController.getAllBuses(req, res));
app.get('/api/buses/pending', authMiddleware, (req, res) => busController.getPendingModifications(req, res));
app.get('/api/buses/:busId/history', authMiddleware, (req, res) => busController.getBusHistory(req, res));
app.get('/api/buses/:busId/edit-request', authMiddleware, (req, res) => busController.getEditRequest(req, res));
app.get('/api/buses/:busId', authMiddleware, (req, res) => busController.getBusById(req, res));
app.post('/api/buses', authMiddleware, (req, res) => busController.createBus(req, res));
app.post('/api/buses/:busId/approve', authMiddleware, (req, res) => busController.approveBus(req, res));
app.post('/api/buses/:busId/edit', authMiddleware, (req, res) => busController.requestEdit(req, res));
app.post('/api/buses/:busId/delete', authMiddleware, (req, res) => busController.requestDelete(req, res));
app.post('/api/buses/:busId/approve-edit', authMiddleware, (req, res) => busController.approveEdit(req, res));
app.post('/api/buses/:busId/approve-delete', authMiddleware, (req, res) => busController.approveDelete(req, res));
app.post('/api/buses/:busId/reject', authMiddleware, (req, res) => busController.rejectModification(req, res));

// Ad routes
app.get('/api/ads', authMiddleware, (req, res) => adController.getAllAds(req, res));
app.get('/api/ads/pending', authMiddleware, (req, res) => adController.getPendingModifications(req, res));
app.get('/api/ads/:adId/history', authMiddleware, (req, res) => adController.getAdHistory(req, res));
app.get('/api/ads/:adId', authMiddleware, (req, res) => adController.getAdById(req, res));
app.post('/api/ads', authMiddleware, (req, res) => adController.createAd(req, res));
app.post('/api/ads/:adId/approve', authMiddleware, (req, res) => adController.approveAd(req, res));
app.post('/api/ads/:adId/edit', authMiddleware, (req, res) => adController.requestEdit(req, res));
app.post('/api/ads/:adId/delete', authMiddleware, (req, res) => adController.requestDelete(req, res));
app.post('/api/ads/:adId/approve-edit', authMiddleware, (req, res) => adController.approveEdit(req, res));
app.post('/api/ads/:adId/approve-delete', authMiddleware, (req, res) => adController.approveDelete(req, res));
app.post('/api/ads/:adId/reject', authMiddleware, (req, res) => adController.rejectModification(req, res));

// Stop routes
app.post('/api/stops', authMiddleware, (req, res) => stopController.createStop(req, res));
app.get('/api/stops', authMiddleware, (req, res) => stopController.getAllStops(req, res));
app.get('/api/stops/:id', authMiddleware, (req, res) => stopController.getStopById(req, res));
app.put('/api/stops/:id', authMiddleware, (req, res) => stopController.updateStop(req, res));
app.delete('/api/stops/:id', authMiddleware, (req, res) => stopController.deleteStop(req, res));

// Route routes
app.post('/api/routes', authMiddleware, (req, res) => routeController.createRoute(req, res));
app.get('/api/routes', authMiddleware, (req, res) => routeController.getAllRoutes(req, res));
app.get('/api/routes/:id', authMiddleware, (req, res) => routeController.getRouteById(req, res));
app.get('/api/buses/:busId/routes', authMiddleware, (req, res) => routeController.getRoutesByBusId(req, res));
app.put('/api/routes/:id', authMiddleware, (req, res) => routeController.updateRoute(req, res));
app.delete('/api/routes/:id', authMiddleware, (req, res) => routeController.deleteRoute(req, res));

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