// AI-generated cron job example
// Schedules tasks to run at regular intervals

const cron = require('node-cron');

// Task 1: runs every 5 seconds
cron.schedule('*/5 * * * * *', () => {
    console.log(`[${new Date().toISOString()}] Task 1 executed`);
});

// Task 2: runs every 10 seconds
cron.schedule('*/10 * * * * *', () => {
    console.log(`[${new Date().toISOString()}] Task 2 executed`);
});

// Task 3: runs every minute
cron.schedule('* * * * *', () => {
    console.log(`[${new Date().toISOString()}] Task 3 executed`);
});

console.log('Cron jobs scheduled...');
