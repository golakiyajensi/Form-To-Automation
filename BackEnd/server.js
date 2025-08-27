const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const formRoutes = require('./routes/formRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes 
app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
