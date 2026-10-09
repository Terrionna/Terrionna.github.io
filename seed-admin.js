// Creates the first admin account.
// Registering never makes an admin, so this is run once from the terminal.
const db = require('./src/config/db');
const User = require('./src/models/user');

const seed = async () => {
    // Get the name, email, and password from the environment.
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    // Stop if any of them is missing.
    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
        console.error('Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD first');
        process.exit(1);
    }

    await db.connect();

    // Create the admin with the password saved as a salt and hash.
    const admin = new User({ name: ADMIN_NAME, email: ADMIN_EMAIL, role: 'admin' });
    admin.setPassword(ADMIN_PASSWORD);
    await admin.save();
    console.log('Admin account created');

    await db.close();
};

// Log any error and exit.
seed().catch((err) => {
    console.error('Seeding failed:', err.message);
    process.exit(1);
});