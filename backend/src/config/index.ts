import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const authMode = process.env.AUTH_MODE || (isProduction ? 'production' : 'development');

if (isProduction) {
  if (!process.env.JWT_SECRET) {
    console.error('❌ FATAL SECURITY ERROR: JWT_SECRET environment variable is missing in production mode!');
    process.exit(1);
  }
}

export const config = {
  port: process.env.PORT || 5001,
  jwtSecret: process.env.JWT_SECRET || 'tribal_scholar_ai_dev_secret_key_2026',
  nodeEnv: process.env.NODE_ENV || 'development',
  authMode: authMode,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
