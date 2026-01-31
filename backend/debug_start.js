require('dotenv').config();
const path = require('path');

console.log('Current directory:', __dirname);
console.log('Checking authMiddleware export...');

try {
    const authMiddleware = require('./middleware/authMiddleware');
    console.log('authMiddleware export:', authMiddleware);
    console.log('authenticateToken type:', typeof authMiddleware.authenticateToken);
} catch (error) {
    console.error('Error requiring authMiddleware:', error);
}

console.log('Checking reports.routes...');
try {
    const reportsRoutes = require('./routes/reports.routes');
    console.log('reportsRoutes loaded successfully');
} catch (error) {
    console.error('Error requiring reports.routes:', error);
}
