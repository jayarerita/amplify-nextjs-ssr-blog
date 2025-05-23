// Enable detailed logging for development/debugging
const DEBUG = process.env.DEBUG === 'true';

export function log(message: string, data?: any) {
  if (DEBUG) {
    console.log(`[DeleteDemoData] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
}