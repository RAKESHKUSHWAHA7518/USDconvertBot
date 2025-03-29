const cron = require('node-cron');
const { generateDailyReport, cleanupOldRecords } = require('./db');

// Daily report job at 12:05 AM
cron.schedule('5 0 * * *', () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split('T')[0];
  const report = generateDailyReport(dateStr);
  console.log(`Daily Report for ${dateStr}:`, report);
});

// Auto-cleanup job at 1:00 AM
cron.schedule('0 1 * * *', () => {
  cleanupOldRecords();
  console.log("Old records cleaned up.");
});
