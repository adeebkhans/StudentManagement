const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI); 
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
});
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// Basic route
app.get('/', (req, res) => {
    res.send('Server is running');
});

app.use('/api/v1/auth', require('./Routes/AuthRoutes'));
app.use('/api/v1/students', require('./Routes/StudentRoutes'));
app.use('/api/v1/fees', require('./Routes/FeeRoutes'));

// Start server
const PORT = process.env.PORT || 3009;
app.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}`);
});