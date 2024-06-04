const mongoose = require('mongoose')
require('dotenv').config();

// Define the MongoDB connection URL
const mongoURL = process.env.LOCAL_URL;

// Set up MongoDB connection
mongoose.connect(mongoURL);

// Get the default connection
// Mongoose maintains a default connection Object representing the MongoDB connection.
const db = mongoose.connection;

// Define event listners for db connection
db.on('connected', () => {
    console.log('Connected to MongoDB server');
});

db.on('error', (err) => {
    console.log('Error while connecting to MongoDB server', err);
});

db.on('disconnected', () => {
    console.log('MongoDB Disconnected');
});

//export the database connection object
module.exports = db;