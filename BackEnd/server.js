const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const formRoutes = require('./routes/formRoutes');
const formfieldsRoutes = require('./routes/formFieldRoutes');
const responseRoutes = require('./routes/responseRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes 
app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/forms-fields', formfieldsRoutes);
app.use('/api/form-responses', responseRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/user', userRoutes);

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
