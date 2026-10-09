// Loads the starting tests into the database.
// Running it again skips tests that are already there.
const db = require('./src/config/db');
const Test = require('./src/models/test');

// Each answer is the position of the correct choice, starting at 0.
// A passing score of 80 needs 4 of 5 correct.
const tests = [
    {
        title: 'Secure Coding Basics',
        version: 1,
        passingScore: 80,
        questions: [
            {
                text: 'What is a buffer overflow?',
                choices: [
                    'Running out of disk space',
                    'A network connection that stays open too long',
                    'Writing more data into a memory buffer than it can hold',
                    'Loading a page more slowly than expected'
                ],
                answer: 2
            },
            {
                text: 'Which practice best prevents SQL injection?',
                choices: [
                    'Hiding the database address',
                    'Using parameterized queries',
                    'Making passwords longer',
                    'Turning off error logging'
                ],
                answer: 1
            },
            {
                text: 'What does defense in depth mean?',
                choices: [
                    'Using one very strong security control',
                    'Hiding the source code',
                    'Encrypting only the database',
                    'Using several layers of security so one failure does not expose the system'
                ],
                answer: 3
            },
            {
                text: 'Why must input be validated on the server even when the browser already checks it?',
                choices: [
                    'Browser checks can be bypassed by sending requests directly',
                    'Browsers cannot display error messages',
                    'Servers check input faster',
                    'Validation is only needed once'
                ],
                answer: 0
            },
            {
                text: 'Where should a database password be kept?',
                choices: [
                    'Written in the source code',
                    'In a comment beside the connection string',
                    'In an environment variable outside the code',
                    'In the browser local storage'
                ],
                answer: 2
            }
        ]
    },
    {
        title: 'Web API Fundamentals',
        version: 1,
        passingScore: 80,
        questions: [
            {
                text: 'Which HTTP verb is used to read data from an API?',
                choices: ['GET', 'POST', 'PUT', 'DELETE'],
                answer: 0
            },
            {
                text: 'Which status code means the requested record was not found?',
                choices: ['200', '401', '404', '500'],
                answer: 2
            },
            {
                text: 'Why is a password stored as a salted hash instead of plain text?',
                choices: [
                    'It makes the password shorter',
                    'It lets the server email the password back',
                    'It makes logins faster',
                    'The original password is not exposed if the database is leaked'
                ],
                answer: 3
            },
            {
                text: 'Which status code means the user is not signed in?',
                choices: ['200', '401', '403', '409'],
                answer: 1
            },
            {
                text: 'What does CRUD stand for?',
                choices: [
                    'Connect, Run, Update, Deploy',
                    'Copy, Restore, Undo, Delete',
                    'Create, Read, Update, Delete',
                    'Create, Render, Upload, Download'
                ],
                answer: 2
            }
        ]
    }
];

// Saves each test as published.
const seed = async () => {
    await db.connect();

    for (const test of tests) {
        // Skip the test if this title and version already exist.
        const existing = await Test.findOne({ title: test.title, version: test.version }).exec();
        if (existing) {
            console.log(`Skipped ${test.title} version ${test.version}, already loaded`);
            continue;
        }
        // Save it as published.
        await Test.create({ ...test, published: true });
        console.log(`Loaded ${test.title} version ${test.version}`);
    }

    await db.close();
};

// Log any error and exit.
seed().catch((err) => {
    console.error('Seeding failed:', err.message);
    process.exit(1);
});