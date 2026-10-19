---
title: Professional Self Assessment
---

# 📓 Professional Self Assessment

[🐙 Back to the Bunker Log](/)

### Where I Started

I walked into this program with a past that had nothing to do with code. I was an assistant head chef, I worked food service management, I audited and analyzed data at IDES, and now I do support and tech consulting at SableVet. Turns out a kitchen on a Friday night is great training for production bugs. Everybody is yelling, the clock is the boss, and one bad handoff ruins the whole plate. The program gave me the other half, which is writing software I can explain, test, and defend. Testify is where both halves finally showed up to the same fight.

### Nobody Hunts Alone

In a kitchen I counted on my crew to hit their marks, and in support I count on clean handoffs and honest feedback. Same rule here. For the code review I walked my instructor through every weak spot in three of my old projects, laid out the plan to fix each one, and then did what I said I would do. I treat my old code like a teammate's pull request. Name the problems straight, rank them, and fix them in an order that makes sense.

### Talking to Civilians

I spend my days explaining technical problems to people who did not sign up for a technical problem. I change the words for each person and never change the facts. Every narrative on this site follows that rule. What the old code did, what was wrong with it, what I changed, and what I learned, all in plain language an outsider can follow. Before anything goes out I check every claim against the repository. If I say the code does it, the code does it.

### The Algorithms Case

The linked list from CS 300 started life as a pile of bids in C++ and now keeps the version history for Testify tests. The review found that search walked the list one node at a time, so the more versions it held, the slower it got. That is O(n). I added a Map that points a version number straight at its node, so lookups run in O(1) on average. Then I wrote a benchmark at 1,000, 10,000, and 100,000 versions, because I wanted real numbers and not a gut feeling. The index costs one extra entry in memory per version. I made that call on purpose, and weighing a cost against a payoff is the habit I took from this one.

### Building the Fortress

On the software engineering side, the CS 340 AnimalShelter class got ripped out of Python and rebuilt in JavaScript on Node, Express, and Mongoose as the Testify backend. It has accounts, signed tokens, two roles, scoring on the server, input checks on every write, and one shared error helper so raw errors never leave the building. The Travlr data layer from CS 465 got the database treatment. That means attempts and certificates, indexes picked from the queries my controllers actually run, a query layer that keeps database calls out of the controllers, an upsert that issues one certificate per person per test, and an aggregation pipeline that reports attempts, passes, pass rate, and average score for every test version. I also built the Angular frontend, deployed the API on Render with the data in MongoDB Atlas, and wrote automated tests for the backend and the frontend.

### Salt, Wards, and Locked Doors

Security is the ward around the whole thing. Passwords are stored as a salt and a hash. Admin accounts only come from a seed script, so nobody gets to pick a role at registration. The server answers 401 when a user is not signed in and 403 when a user is signed in but not allowed. Tests are scored on the server so the answer key never reaches the browser. Login gives the same message for a wrong email and a wrong password, so nobody learns which accounts exist. The database itself refuses a second certificate for the same person and test, so a race between two requests cannot slip past the controller. The API only takes browser requests from the address of the frontend. I read code now by asking how a monster would abuse it before I ask whether it works.

### Closing the Case

Put together, these artifacts show a developer who can design a system, pick the right tools, measure the result, lock down the data, and explain it all to somebody else. Testify is not finished, and I plan to keep building it. What I take out of this program is the habit of finding the weak points in my own code before anyone else does and fixing them, and that is what I want to bring to my work as a software developer.
