# Gyaan Arena

A gamified learning app for CBSE students from Grade 6 to 10, plus College skills. Players practise Maths, Science, English and General Knowledge, earn coins, unlock grades and dress up their avatar.

## Features

- **Login:** each player picks a name and a 4-digit PIN. Several players can share one device.
- **Quizzes:** 101 chapters named after the NCERT textbooks. Maths questions are generated fresh every time.
- **Progress:** each chapter earns up to 3 stars from the player's last 10 answers. Reaching 2 stars in half of a grade's chapters unlocks the next grade.
- **Fix-it lessons:** each wrong answer gets a narrated, one-minute lesson, plus a link to YouTube videos for that chapter.
- **Games:** Speed Sprint, Make 24, Word Scramble and Fact Flash.
- **Rewards:** coins, an accessory shop (or an uploaded profile photo), badges, a daily challenge and a leaderboard.

## Run it

The app needs no build step. Open `index.html` in a browser, or host the folder with GitHub Pages: go to **Settings → Pages**, choose the `main` branch and the root folder, then save.

## Files

| File | What it holds |
| --- | --- |
| `index.html` | Page layout and styles |
| `content.js` | Chapters, question banks and maths question generators |
| `lessons.js` | The fix-it lesson for each chapter |
| `app.js` | Accounts, quizzes, progress, games, shop and leaderboard |

## Limits of the GitHub Pages version

Progress is saved in each browser's local storage, and the leaderboard only covers players on the same device. The claude.ai version also has a shared online leaderboard and the "Ask Claude why I got it wrong" button. Neither is available on GitHub Pages yet, because both need a backend.
