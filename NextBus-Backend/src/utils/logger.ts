import fs from 'fs';
import path from 'path';

// Create a logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
try {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
} catch (error) {
  console.error('Failed to create logs directory:', error);
}

// Create a log file
const logFile = path.join(logsDir, 'debug.log');

// Function to write to the log file
export const logDebug = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  let logMessage = `[${timestamp}] ${message}`;
  
  if (data) {
    if (typeof data === 'object') {
      try {
        logMessage += `\n${JSON.stringify(data, null, 2)}`;
      } catch (error) {
        logMessage += `\n[Error stringifying data: ${error}]`;
      }
    } else {
      logMessage += `\n${data}`;
    }
  }
  
  logMessage += '\n';
  
  try {
    // Append to the log file
    fs.appendFileSync(logFile, logMessage);
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
  
  // Always log to console for development
  console.log(`[DEBUG] ${message}`);
  if (data) {
    console.log(data);
  }
}; 