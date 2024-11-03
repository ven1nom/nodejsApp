const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://myUser:44xT$CAL4iSPiE2@cluster0.2fywx.mongodb.net/devtinder');
        console.log('MongoDB Connected'); // Confirm successful connection
    } catch (error) {
        console.error('MongoDB connection error:', error.message); // Log any connection errors
        process.exit(1); // Exit the process if connection fails
    }
};

module.exports = { connectDB };