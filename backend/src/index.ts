import app from './app';
import { config } from './config';
import { seedDemoUsers } from './utils/seedDemoUsers';

let seedOfficialSchemes: () => Promise<void> = async () => {};
try {
  const seedModule = require(require('path').join(__dirname, '../../prisma/seedOfficialSchemes'));
  if (seedModule && seedModule.seedOfficialSchemes) {
    seedOfficialSchemes = seedModule.seedOfficialSchemes;
  }
} catch (e) {
  // Graceful fallback for compiled build
}

Promise.all([seedDemoUsers(), seedOfficialSchemes()])
  .then(() => {
    app.listen(config.port, () => {
      console.log(`
  =======================================================
  🏛️  TRIBAL SCHOLAR AI - MINISTRY OF TRIBAL AFFAIRS
  =======================================================
  🚀 Backend REST API Server is running on port ${config.port}
  🌐 Environment: ${config.nodeEnv}
  📡 Health Check: http://localhost:${config.port}/api/health
  =======================================================
      `);
    });
  })
  .catch((err) => {
    console.error('❌ Server startup initialization warning:', err);
    app.listen(config.port);
  });
