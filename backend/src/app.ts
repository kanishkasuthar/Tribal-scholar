import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config';

import authRoutes from './routes/authRoutes';
import { testEmail, verifyTransportEndpoint, getCurrentDevOtp } from './controllers/authController';
import studentRoutes from './routes/studentRoutes';
import scholarshipRoutes from './routes/scholarshipRoutes';
import matchingRoutes from './routes/matchingRoutes';
import documentRoutes from './routes/documentRoutes';
import applicationRoutes from './routes/applicationRoutes';
import instituteRoutes from './routes/instituteRoutes';
import adminRoutes from './routes/adminRoutes';
import grievanceRoutes from './routes/grievanceRoutes';
import assistantRoutes from './routes/assistantRoutes';
import deficiencyCopilotRoutes from './routes/deficiencyCopilotRoutes';

import studentLifecycleRoutes from './routes/studentLifecycleRoutes';
import userPreferenceRoutes from './routes/userPreferenceRoutes';
import processIntelligenceRoutes from './routes/processIntelligenceRoutes';

const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static directory for document uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    system: 'Tribal Scholar AI - Ministry of Tribal Affairs',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.post('/api/test-email', testEmail);
app.post('/api/dev/test-email', testEmail);
app.get('/api/dev/verify-transport', verifyTransportEndpoint);
app.get('/api/verify-transport', verifyTransportEndpoint);
app.get('/api/dev/current-otp', getCurrentDevOtp);
app.use('/api/auth', authRoutes);
app.use('/api/ai', assistantRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/student', studentLifecycleRoutes);
app.use('/api', userPreferenceRoutes);
app.use('/api', scholarshipRoutes);
app.use('/api', matchingRoutes);
app.use('/api', documentRoutes);
app.use('/api', deficiencyCopilotRoutes);
app.use('/api', applicationRoutes);
app.use('/api/institute', instituteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/process-intelligence', processIntelligenceRoutes);
app.use('/api', grievanceRoutes);


// Centralized Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
