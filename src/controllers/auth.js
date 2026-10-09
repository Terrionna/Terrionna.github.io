// Account controller for Testify.
// Handles registering and logging in.
const User = require('../models/user');
const { sendError } = require('../utils/errors');

// Returns true if the value is a string with something in it.
const isText = (value) => typeof value === 'string' && value.trim().length > 0;

// POST: /api/register, creates a taker account and returns a token.
const register = async (req, res) => {
    const { name, email, password } = req.body;

    // Check the input first.
    if (!isText(name) || !isText(email) || !isText(password)) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    try {
        // Only the name and email are used. A role sent in the request is ignored.
        const user = new User({ name, email });
        user.setPassword(password);
        await user.save();
        return res.status(201).json({ token: user.generateJwt() });
    } catch (err) {
        return sendError(res, err);
    }
};

// POST: /api/login, checks the email and password and returns a token.
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!isText(email) || !isText(password)) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Emails are saved in lowercase.
        const user = await User.findOne({ email: email.toLowerCase().trim() }).exec();

        // Same message for a wrong email and a wrong password.
        if (!user || !user.validPassword(password)) {
            return res.status(401).json({ message: 'Incorrect email or password' });
        }
        return res.status(200).json({ token: user.generateJwt() });
    } catch (err) {
        return sendError(res, err);
    }
};

module.exports = { register, login };