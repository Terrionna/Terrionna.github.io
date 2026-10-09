// Test model for Testify.
// Each version of a test is its own document, so an attempt points to the version taken.
const mongoose = require('mongoose');

// Schema for one question. Questions are stored inside a test, not on their own.
const questionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    // A question needs at least two choices.
    choices: { type: [String], validate: (list) => list.length >= 2 },
    // The position of the correct choice, counting from 0.
    answer: { type: Number, required: true }
});

const testSchema = new mongoose.Schema({
    title: { type: String, required: true },
    passingScore: { type: Number, required: true, min: 0, max: 100 },
    version: { type: Number, required: true, min: 1 },
    // A new test starts as a draft. Takers only see published tests.
    published: { type: Boolean, default: false },
    // A test needs at least one question.
    questions: { type: [questionSchema], validate: (list) => list.length > 0 }
});

// One title can have many versions, but never the same version twice.
testSchema.index({ title: 1, version: 1 }, { unique: true });

module.exports = mongoose.model('tests', testSchema);