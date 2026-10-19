---
title: Software Design and Engineering
---

# 🧰 Software Design and Engineering

[🐙 Back to the Bunker Log](/)

[![testify-backend](https://github-readme-stats.shion.dev/api/pin/?username=Terrionna&repo=testify-backend&border_color=ff69b4&title_color=ff69b4&icon_color=ff69b4&text_color=333333&cache=1)](https://github.com/Terrionna/testify-backend)

[🌐 Try the live Testify site](https://testify-frontend-vbt5.onrender.com)

### The Case File

The artifact is the AnimalShelter CRUD class from CS 340, Client/Server Development, which I built in the spring of 2026. It is a Python class that talks to MongoDB and handles create, read, update, and delete for the dashboard project in that course. It was the data access layer, and it got the job done, but the code review turned up some ugly stuff. The username and password were sitting in plain text in the constructor. The connection had no error handling and never closed. The create method pointed at a different collection reference than every other method. And the only input check was for an empty value.

### Why This One Got the Job

This class is solid ground for the Testify backend, my capstone project, which is a test taking site. The parts that show my software design and engineering skills are the parts I tore out and rebuilt. I ported the class from Python to JavaScript so it runs on Node and Express. The database address moved into an environment variable, the connection got error handling and a clean shutdown, and every collection got its own model. Then I built the rest of the backend on top. It has account creation and login, with passwords stored as a salt and a hash and signed tokens that prove who a user is. There are two roles, taker and admin, and admins only come from a seed script so nobody gets to pick a role at registration. Admins can create, edit, publish, and delete tests. Takers can list the published tests, open one without seeing the correct answers, and submit their answers to be scored on the server. Every function that writes data checks its input first, and every error goes through one helper that sends a short message and the right status code.

### Objectives Hit

Back in Module One I planned to hit outcome three, designing and evaluating a computing solution while managing the tradeoffs, and outcome four, using well founded techniques and tools to deliver value. Both landed. For outcome three, the tradeoffs are right there in the design. Scoring on the server costs an extra request but keeps the answer key private. Login gives the same message for a wrong email and a wrong password, so it never tells anyone whether an account exists. For outcome four, the port to JavaScript and the Express, Mongoose, MongoDB, and token stack are the tools. My plan for this enhancement did not change. The work also covers the security outcome, which I did not list in Module One, thanks to the salted and hashed passwords, the roles, the input checks, and the hidden answers.

### What I Learned

Tokens and roles finally clicked. When a user signs in, the server builds a token that holds their id, email, name, role, and an expiry date, and signs it with a secret kept outside the code. Every later request sends that token back, and the server checks the signature and the expiry before the controller runs. I kept that check in its own functions, one that confirms a valid token and one that confirms the admin role. A request gets a 401 when the user is not signed in and a 403 when the user is signed in but not allowed. These were new and complicated ideas for me, and building them myself made them make sense.

### Where It Bit Back

The trouble was in the details. I did a lot of googling, because so much of this was new to me. Porting Python to JavaScript meant getting used to asynchronous code, where a function has to wait for the database before it moves on. Small mistakes were nasty to spot, like a comment that started with one slash instead of two, which kept the server from starting, and a missing line in a model file that broke the seed script. Keeping the secrets in environment variables took careful work too. Fighting through each one taught me to read error messages closely and test one piece at a time, and it left me more confident building a backend on my own.
