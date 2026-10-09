// Attempt controller for Testify.
// Scores a submitted test, saves the attempt, and issues a certificate if the test is passed.
const crypto = require('crypto');
const Test = require('../models/test');
const Attempt = require('../models/attempt');
const Certificate = require('../models/certificate');
const { sendError } = require('../utils/errors');

// POST: /api/tests/:id/attempts, scores a submitted test.
// The score is figured out here on the server.
const submit = async (req, res) => {
    const { answers } = req.body;

    // The answers must be a list of whole numbers.
    if (!Array.isArray(answers) || !answers.every(Number.isInteger)) {
        return res.status(400).json({ message: 'Answers must be a list of whole numbers' });
    }

    try {
        // Find the published test.
        const test = await Test.findOne({ _id: req.params.id, published: true }).exec();
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // There must be one answer for each question.
        const total = test.questions.length;
        if (answers.length !== total) {
            return res.status(400).json({ message: 'One answer is required for every question' });
        }

        // Count the correct answers.
        let correct = 0;
        test.questions.forEach((question, index) => {
            if (answers[index] === question.answer) {
                correct += 1;
            }
        });

        // The score is a percent. Total is never zero because a test has at least one question.
        const score = Math.round((correct / total) * 100);
        const passed = score >= test.passingScore;

        // Save the attempt with the test and version that was taken.
        await Attempt.create({
            user: req.auth._id,
            test: test._id,
            testVersion: test.version,
            answers,
            score,
            passed
        });

        // Issue a certificate if the test was passed. Each user gets one per test.
        let certificateCode = null;
        if (passed) {
            const existing = await Certificate.findOne({ user: req.auth._id, test: test._id }).exec();
            const certificate = existing || await Certificate.create({
                user: req.auth._id,
                test: test._id,
                testVersion: test.version,
                // Random code used to verify the certificate.
                code: crypto.randomBytes(8).toString('hex')
            });
            certificateCode = certificate.code;
        }

        // Return the result without the answers.
        return res.status(201).json({ score, passed, correct, total, certificateCode });
    } catch (err) {
        return sendError(res, err);
    }
};

// GET: /api/attempts/mine, returns the user's own attempts, newest first.
const mine = async (req, res) => {
    try {
        const attempts = await Attempt.find({ user: req.auth._id })
            // Add the test title.
            .populate('test', 'title')
            // Leave out the answers.
            .select('-answers')
            .sort({ takenAt: -1 })
            .exec();
        return res.status(200).json(attempts);
    } catch (err) {
        return sendError(res, err);
    }
};

module.exports = { submit, mine };