import app from './app.js';
import { connectDB } from './config/db.js';
import { env, validateEnv } from './config/env.js';

const RETRY_MS = Number(process.env.MONGO_RETRY_MS || 30000);
let connecting = false;

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
  if (connecting) return;

  try {
    connecting = true;
    validateEnv();
    await connectDB();
    app.locals.databaseError = null;
  } catch (error) {
    app.locals.databaseError = error.message
      ?.replace(/mongodb(\+srv)?:\/\/[^\s]+/g, 'mongodb://<redacted>')
      .slice(0, 280);
    logStartupError(error);
    setTimeout(connectWithDiagnostics, RETRY_MS);
  } finally {
    connecting = false;
  }
}

app.listen(env.port, () => {
  console.log(`API running on http://localhost:${env.port}`);
  connectWithDiagnostics();
});
