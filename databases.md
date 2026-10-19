---
title: Databases
---

# 🗄️ Databases

[🐙 Back to the Bunker Log](/)

[![testify-backend](https://github-readme-stats.shion.dev/api/pin/?username=Terrionna&repo=testify-backend&border_color=ff69b4&title_color=ff69b4&icon_color=ff69b4&text_color=333333&cache=1)](https://github.com/Terrionna/testify-backend)

[🌐 Try the live Testify site](https://testify-frontend-vbt5.onrender.com)

### The Case File

The artifact is the database layer of Travlr Getaways from CS 465, a MEAN stack travel booking application. It includes the users model, the database connection, the Passport configuration, the authentication controller, the trips model, and the rooms controller. My code review turned up a pile of problems. The rooms controller checked for a missing result before it checked for an error. Its write functions did no input validation. It handed raw error objects straight to the client. Its catch blocks left the err variable undeclared. The authentication controller had the same sickness, and login returned 404 for an internal failure instead of 500.

### Why This One Got the Job

This is the strongest example in my coursework of designing collections, relationships, and queries. Reusing its authentication pattern for Testify let me build on code I had already reviewed and understood. The enhancement adds new collections for attempts and certificates, with indexes matched to how they are actually queried. Attempts are indexed on the user and the time taken, because attempts are listed by user, newest first. Attempts are also indexed on the test, because admins list every attempt on one test version. Certificates have a unique index on the code, because a code is how a certificate gets verified. Certificates also have a unique compound index on the user and the test together, so the database refuses a second certificate for the same person and test. I wrote a query layer that keeps the database calls out of the controllers. I wrote an upsert that issues a certificate only if one does not already exist, so two passing attempts landing at nearly the same moment cannot create two certificates. I wrote an aggregation pipeline that groups attempts by test, joins in the test's title and version, and reports the attempt count, the pass count, the pass rate, and the average score for every version. And I fixed everything the review found. Every controller checks for an error separately from a missing record. Every write validates its input first. Every error goes through one shared helper that never exposes the raw error. Login returns 500 for an internal failure instead of 404.

### Objectives Hit

In Module One I planned to hit outcome four, using well founded tools and techniques to implement a solution that delivers value. I hit it. Mongoose schemas, compound and unique indexes, a query layer, and an aggregation pipeline are the tools. The stats they produce are the value, a clear view into how every test is performing. The work also supports outcome five. The unique compound index on certificates is a security and integrity rule enforced by the database itself, and it is paired with the upsert so a race between two requests cannot slip past it. My plan for this enhancement did not change.

### What I Learned

The big lesson was deciding what the database should enforce on its own instead of trusting the controller to catch every case. With the unique compound index on certificates, even if two requests to submit a passing attempt arrive at the same moment, only one certificate can be created. MongoDB itself rejects the second insert. I had to write the upsert to expect that rejection and recover from it, reading the certificate the first request already created instead of treating it as a failure. I also learned to pick indexes by looking at the actual queries my own controllers run, not by indexing everything in sight.

### Where It Bit Back

The aggregation pipeline was the boss fight. Each stage changes the shape of the data before the next stage runs, so a mistake early on shows up as nonsense three stages later. Getting the join and the rounding right took several passes of checking the output at every step. Working through it left me with a much clearer sense of how a database schema and the queries built on it depend on each other.
