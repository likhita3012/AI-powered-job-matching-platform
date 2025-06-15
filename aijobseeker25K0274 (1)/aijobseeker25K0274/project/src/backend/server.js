const emailRoutes = require('./routes/email');
require('dotenv').config();

// Add email routes
app.use('/api/email', emailRoutes); 