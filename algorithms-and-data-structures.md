---
title: Algorithms and Data Structures
---

# 🧮 Algorithms and Data Structures

[🐙 Back to the Bunker Log](/)

[![testify-backend](https://github-readme-stats.shion.dev/api/pin/?username=Terrionna&repo=testify-backend&border_color=ff69b4&title_color=ff69b4&icon_color=ff69b4&text_color=333333&cache=1)](https://github.com/Terrionna/testify-backend)

[🌐 Try the live Testify site](https://testify-frontend-vbt5.onrender.com)

### The Case File

The artifact is the linked list I built in CS 300, written in C++ in the summer of 2025. It stores bid records in a singly linked list. Each node holds one bid and a pointer to the next node, and the list keeps a head, a tail, and a size. It can append, prepend, print, remove, and search, and it loads its bids from a CSV file. My code review found five problems. Prepend was defined and never used. The loadBids function read columns by hardcoded numbers. The menu switch had no default case. Search started at the head and checked one node at a time, so its time grew with the size of the list, which is O(n). And strToDouble turned a badly formed number into zero without saying a word.

### Why This One Got the Job

A linked list shows I understand how a data structure works, and fixing it shows I can judge and change how it performs. I ported the list from C++ to JavaScript so it runs inside Testify, and I gave it a new job tracking the versions of a test. Each node holds one version, the list keeps every earlier version in order, and the tail is always the newest. Adding a version at the tail is O(1). To fix the slow search I added an index, a Map that connects a version number to its node, so a version is found in O(1) time on average instead of O(n). I kept the old walking search so I could race the two, and I wrote a benchmark that times both at 1,000, 10,000, and 100,000 versions. The walking search slows down as the list grows. The indexed search barely notices. The rest of the review findings got fixed too. The unused prepend and the CSV loader with its hardcoded columns are gone. A new parser throws an error that names the bad value instead of quietly turning it into zero. The demo menu has a default case and named constants. I wired the list into the test controller so a new version of a test gets its number from the list, and I added admin routes that return a test's version history and any one version. Unit tests cover the list and the parser.

### Objectives Hit

In Module One I planned to hit outcome three, designing and evaluating a computing solution while managing the tradeoffs. I hit it. The tradeoff is the index. It makes lookups fast, but it costs one extra entry in memory for every version. I took that deal because the cost is small next to the speed it buys. The work also supports outcome four, because I used a Map, Node's built in test runner, and a port to a new language to build a working solution. It supports outcome five too. The parser rejects bad input instead of hiding it, and the list refuses a version that is repeated or out of order. My plan for this enhancement did not change.

### What I Learned

One small addition can change the cost of an operation in a big way. The index turned a search that grows with the list into one that does not, and it took only one extra structure. I also learned to measure. I could have assumed the index was faster, but the benchmark showed how much faster and gave me numbers to back it up. Porting from C++ to JavaScript showed me what the language handles for me. I no longer manage memory or write a destructor, but I still have to keep the links between nodes correct.

### Where It Bit Back

The hardest part was deciding how the list and the database should work together. I made the database the source of truth and build the list from it when it is needed, so the two can never disagree. The other hard part was deciding what to cut. Prepend and remove were part of the original, but versions are permanent, so leaving them out made the list smaller and safer. A good data structure fits the job it is given, and this project drove that home.
