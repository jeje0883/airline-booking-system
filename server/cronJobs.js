const cron = require('node-cron');
const fetch = require('node-fetch'); // Or use built-in fetch in Node.js 18+

const fetchData = async () => {
  try {
    const response = await fetch('https://airline-booking-system-5n0j.onrender.com/flights/airports');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log(`[${new Date().toISOString()}] Data fetched successfully:`, data);
    // Add any additional processing here
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error fetching data:`, error);
    // Implement retry logic or notifications if necessary
  }
};

// Schedule task every 13 minutes
cron.schedule('*/13 * * * *', () => {
  console.log(`[${new Date().toISOString()}] Running task every 13 minutes`);
  fetchData();
});

// Schedule task every 13 minutes and 30 seconds
setInterval(() => {
  console.log(`[${new Date().toISOString()}] Running task every 13 minutes and 30 seconds`);
  fetchData();
}, 13.5 * 60 * 1000); // 13.5 minutes

module.exports = fetchData;
