// Test controller for Testify.
// Takers can list and open published tests. Admins can create, edit, publish, version, and delete tests.
const Test = require('../models/test');
const { sendError } = require('../utils/errors');

// Checks the test data. Returns a message for the first problem, or null if the data is fine.
const validateTest = (body) => {
    const { title, passingScore, version, questions } = body;

    if (typeof title !== 'string' || !title.trim()) {
        return 'Title is required';
    }
    if (!Number.isFinite(passingScore) || passingScore < 0 || passingScore > 100) {
        return 'Passing score must be a number from 0 to 100';
    }
    if (!Number.isInteger(version) || version < 1) {
        return 'Version must be a whole number of 1 or more';
    }
    if (!Array.isArray(questions) || questions.length === 0) {
        return 'At least one question is required';
    }

    // Check each question.
    for (const question of questions) {
        if (!question || typeof question.text !== 'string' || !question.text.trim()) {
            return 'Every question needs text';
        }
        const choices = question.choices;
        if (!Array.isArray(choices) || choices.length < 2 ||
            !choices.every((choice) => typeof choice === 'string' && choice.trim())) {
            return 'Every question needs at least two choices';
        }
        // The answer has to be the position of one of the choices.
        if (!Number.isInteger(question.answer) || question.answer < 0 ||
            question.answer >= choices.length) {
            return 'Every answer must point to one of the choices';
        }
    }
    return null;
};

// Functions for takers.

// GET: /api/tests, returns all published tests.
const listPublished = async (req, res) => {
    try {
        const tests = await Test.find({ published: true })
            .select('title version passingScore')
            .exec();
        return res.status(200).json(tests);
    } catch (err) {
        return sendError(res, err);
    }
};

// GET: /api/tests/:id, returns one published test.
const getPublished = async (req, res) => {
    try {
        const test = await Test.findOne({ _id: req.params.id, published: true })
            // Do not send the answers.
            .select('-questions.answer')
            .exec();
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }
        return res.status(200).json(test);
    } catch (err) {
        return sendError(res, err);
    }
};

// Functions for admins.

// GET: /api/admin/tests, returns all tests, including drafts.
const listAll = async (req, res) => {
    try {
        const tests = await Test.find({}).exec();
        return res.status(200).json(tests);
    } catch (err) {
        return sendError(res, err);
    }
};

// POST: /api/admin/tests, creates a draft test.
const create = async (req, res) => {
    // Validate the data first.
    const problem = validateTest(req.body);
    if (problem) {
        return res.status(400).json({ message: problem });
    }
    const { title, passingScore, version, questions } = req.body;
    try {
        const test = await Test.create({
            title: title.trim(),
            passingScore,
            version,
            questions,
            // New tests are always drafts.
            published: false
        });
        return res.status(201).json(test);
    } catch (err) {
        return sendError(res, err);
    }
};

// PUT: /api/admin/tests/:id, edits a draft test.
const update = async (req, res) => {
    const problem = validateTest(req.body);
    if (problem) {
        return res.status(400).json({ message: problem });
    }
    const { title, passingScore, version, questions } = req.body;
    try {
        const test = await Test.findById(req.params.id).exec();
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }
        // A published test cannot be edited. A change needs a new version.
        if (test.published) {
            return res.status(409).json({ message: 'Published tests cannot be edited. Create a new version instead' });
        }
        test.title = title.trim();
        test.passingScore = passingScore;
        test.version = version;
        test.questions = questions;
        // Save the changes. This runs the schema rules again.
        await test.save();
        return res.status(200).json(test);
    } catch (err) {
        return sendError(res, err);
    }
};

// POST: /api/admin/tests/:id/publish, publishes a draft.
const publish = async (req, res) => {
    try {
        const test = await Test.findByIdAndUpdate(
            req.params.id,
            { published: true },
            // Return the updated test.
            { new: true }
        ).exec();
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }
        return res.status(200).json(test);
    } catch (err) {
        return sendError(res, err);
    }
};

// POST: /api/admin/tests/:id/versions, copies a test into a new draft version.
const newVersion = async (req, res) => {
    try {
        const source = await Test.findById(req.params.id).exec();
        if (!source) {
            return res.status(404).json({ message: 'Test not found' });
        }
        // Find the highest version with this title.
        const latest = await Test.findOne({ title: source.title }).sort({ version: -1 }).exec();
        const copy = await Test.create({
            title: source.title,
            passingScore: source.passingScore,
            version: latest.version + 1,
            // Copy the questions into the new version.
            questions: source.questions.map((q) => ({
                text: q.text,
                choices: q.choices,
                answer: q.answer
            })),
            published: false
        });
        return res.status(201).json(copy);
    } catch (err) {
        return sendError(res, err);
    }
};

// DELETE: /api/admin/tests/:id, deletes a draft.
const remove = async (req, res) => {
    try {
        // Only drafts match. Published tests are never deleted.
        const test = await Test.findOneAndDelete({ _id: req.params.id, published: false }).exec();
        if (!test) {
            return res.status(404).json({ message: 'Draft test not found' });
        }
        // 204 means success with nothing to return.
        return res.status(204).send();
    } catch (err) {
        return sendError(res, err);
    }
};

module.exports = {
    validateTest,
    listPublished,
    getPublished,
    listAll,
    create,
    update,
    publish,
    newVersion,
    remove
};