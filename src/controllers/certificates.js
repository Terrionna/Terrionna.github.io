// Certificate controller for Testify.
// Lists a user's certificates and verifies a certificate by its code.
const Certificate = require('../models/certificate');
const { sendError } = require('../utils/errors');

// GET: /api/certificates/mine, returns the user's own certificates.
const mine = async (req, res) => {
    try {
        // The user id comes from the token.
        const certificates = await Certificate.find({ user: req.auth._id })
            .populate('test', 'title')
            .exec();
        return res.status(200).json(certificates);
    } catch (err) {
        return sendError(res, err);
    }
};

// GET: /api/certificates/verify/:code, checks a certificate by its code.
// No token is needed, so only public information is returned.
const verify = async (req, res) => {
    try {
        const certificate = await Certificate.findOne({ code: req.params.code })
            // Add the holder's name and the test title.
            .populate('user', 'name')
            .populate('test', 'title')
            .exec();
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        // Do not return the email or the user id.
        return res.status(200).json({
            name: certificate.user.name,
            title: certificate.test.title,
            version: certificate.testVersion,
            issuedAt: certificate.issuedAt
        });
    } catch (err) {
        return sendError(res, err);
    }
};

module.exports = { mine, verify };