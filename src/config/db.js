//Database connection This file opens and closes the one MongoDB connection the whole app shares.
const mongoose = require('mongoose');


// Opens the connection. Called once when the server starts.
const connect = async () => {
    // Read the address from the environment.
    const uri = process.env.MONGO_URI;

    // Stop early with a message when the setting is missing.
    if (!uri) {
        throw new Error('MONGO_URI is not set');
    }

    // Wait for MongoDB to accept the connection before anything else runs.
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
};

// Closes the connection.
const close = async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
};

// Share both functions with app.js and the seed scripts.
module.exports = { connect, close };

