const express = require('express');
const cors = require('cors');
require('dotenv').config();

const seedAdmin = require('./utils/seedAdmin');

// Routes imports
const authRoutes = require('./routes/authRoutes');
const formRoutes = require('./routes/formRoutes');
const formfieldsRoutes = require('./routes/formFieldRoutes');
const responseRoutes = require('./routes/responseRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');
const permissionRoutes = require('./routes/permissionRoutes');
const integrationRoutes = require('./routes/integrationRoutes');
const formstyleRoutes = require('./routes/formStyleRoutes');
const systemConfigRoutes = require('./routes/systemConfigRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const slideRoutes = require('./routes/slideRoutes');
const themeRoutes = require('./routes/themeRoutes');
const responsesetting = require('./routes/responseSettingsRoutes');
const Presentationsetting = require('./routes/PresentationSettingsRoutes');
const defaultsetting = require('./routes/defaultSettingsRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Seed Default Admin
seedAdmin();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/forms-fields', formfieldsRoutes);
app.use('/api/form-responses', responseRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/user', userRoutes);
app.use('/api/permission', permissionRoutes);
app.use('/api/integration', integrationRoutes);
app.use('/api/formstyle', formstyleRoutes);
app.use('/api/systemconfig', systemConfigRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/slide', slideRoutes);
app.use('/api/theme', themeRoutes);
app.use('/api/responsesetting', responsesetting);
app.use('/api/Presentationsetting', Presentationsetting);
app.use('/api/defaultsetting', defaultsetting);

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
