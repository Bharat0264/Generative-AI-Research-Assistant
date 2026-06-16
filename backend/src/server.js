import app from './app.js';
import { connectDB } from './config/db.js';
import { env, validateEnv } from './config/env.js';

function logStartupError(error) {
  console.error('Backend startup failed:', error.message);

  if (error.message?.includes('querySrv') || error.message?.includes('ENOTFOUND')) {
    console.error('Check that MONGO_URI is a valid MongoDB Atlas connection string.');
  }

  if (error.message?.includes('Server selection timed out')) {
    console.error('Check MongoDB Atlas Network Access. Render usually needs 0.0.0.0/0 on free services.');
  }
}

async function connectWithDiagnostics() {
  try {
    validateEnv();
    await connectDB();
  } catch (error) {
    logStartupError(error);
  }
}

app.listen(env.port, () => {
  console.log(`API running on http://localhost:${env.port}`);
  connectWithDiagnostics();
});
