---
title: Professional Self Assessment
---

# 📓 Professional Self Assessment

[🐙 Back to the Bunker Log](/)

# Where I Started

Before this program, my background wasn't in traditional software engineering. I spent years working high-pressure operations, from running the line as an assistant head chef and managing food service to auditing data at IDES and handling technical support and consulting at SableVet. Working those jobs teaches you how things actually break when everything is moving too fast. A Friday night kitchen under heavy fire is a lot like debugging a production server when a live user is waiting on a fix. You don't get to panic, you don't get to pass the buck, and if your handoff is sloppy, the whole shift suffers. Computer science gave me the engineering side of that reality, showing me how to build systems that are structured, tested, and actually reliable when things get complicated. Testify is where those two backgrounds came together.

# Nobody Hunts Alone

You don't survive a case alone, and you don't build software alone either. When it came time for the code review, I didn't try to gloss over my past projects. I pulled up my old code, pointed at what was broken, laid out a fix, and did it. I treat bad code the same way you treat a cursed artifact or a bad lead on a hunt. You find the rot, deal with it, and clean it up before it causes problems down the line.

# Talking to Civilians

A big part of my day-to-day work involves explaining technical concepts to people who just need their systems to function without wanting a lecture. You adjust how you talk depending on who is standing in front of you, but you never compromise the facts. Every narrative on this site follows that exact standard. Here is what the old code did, why it was broken, what I changed, and what I learned. No corporate fluff or buzzwords, just straight answers. Before I push anything live, I verify every claim against the actual repository. If I write that the code handles an edge case, it better actually handle it.

# The Algorithms Case

The data structures side of things started as a basic C++ bids project and evolved into the version history tracker for Testify. The original code walked a linked list one node at a time, which results in search operations running in linear time that drag down performance as the history grows. I added a hash map to point version numbers directly to their target nodes, bringing lookups down to constant time on average. Then I ran actual performance benchmarks at one thousand, ten thousand, and one hundred thousand versions because I wanted real numbers instead of guessing. The index takes up a tiny bit of extra memory, but making that deliberate trade-off between speed and storage is the habit I picked up through this program.

# Building the Fortress

On the software engineering side, I took the old AnimalShelter class from Python, tore it down, and rebuilt it entirely in JavaScript using Node, Express, and Mongoose for the Testify backend. It features user accounts, signed tokens, role-based access control, server-side test scoring, strict input validation on every write operation, and a centralized error handler so raw database exceptions never leak out to the client. I also overhauled the Travlr data layer, adding database indexes tuned to match actual query patterns, a clean service layer that keeps database logic out of the controllers, upserts that guarantee one certificate per person per test, and aggregation pipelines that pull attempt counts, pass rates, and average scores per test version. I hooked that up to an Angular frontend, deployed the API on Render with MongoDB Atlas, and wrote automated test suites to keep everything honest.

# Salt, Wards, and Locked Doors

None of that matters if you leave the front door wide open. Security is just the salt line and the iron. Passwords get salted and hashed before they are stored. Admin accounts are seeded manually so nobody can spoof a role during public registration. The server throws the appropriate status code when you are unauthenticated or when you lack clearance. Tests are scored exclusively on the backend so the answer key never hits the client browser. Login endpoints return identical generic error messages for nonexistent emails and bad passwords so attackers cannot map out existing user accounts. The database itself enforces strict constraints to block duplicate certificates, stopping race conditions dead in their tracks. I don't look at code anymore and just assume it works. I look at it trying to figure out how someone could break it.

# Closing the Case

Put all of that together and you get a developer who can design an architecture, pick the right tools, measure performance, lock down the data, and explain how it works without hiding behind jargon. Testify is not done growing yet, and I am going to keep building on it. What I am walking out of this program with is the instinct to hunt down the weak points in my own work before anyone else does, and that is what I am bringing to the job.
