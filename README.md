# Gyaan Arena

A gamified learning app for CBSE students from Grade 6 to 10, plus College skills. Players practise Maths, Science, English and General Knowledge, earn coins, unlock grades and dress up their avatar.

## Features

- **Login:** each player picks a name and a 4-digit PIN. Several players can share one device.
- **Quizzes:** one skill per chapter of the current NCERT textbooks: Ganita Prakash, Curiosity and Poorvi (Classes 6–8), Ganita Manjari, Exploration and Kaveri (Class 9), and the rationalised Class 10 books, plus GK and College sets. Maths questions are generated fresh every time. Each quiz has an animated banner themed to its subject.
- **Progress:** each chapter earns up to 3 stars from the player's last 10 answers. Reaching 2 stars in half of a grade's chapters unlocks the next grade.
- **Fix-it lessons:** each wrong answer gets a narrated, one-minute lesson, plus a link to YouTube videos for that chapter. Narration picks the most natural voice on the device, reads maths aloud as words, and lets the player choose a voice.
- **Games:** Speed Sprint, Make 24, Word Scramble and Fact Flash.
- **Owner dashboard:** players, coin gifts, PIN resets, reward amounts, leaderboard hiding, and onboarding and activity charts. Open it from the sign-in page or Progress (or add `#admin` to the URL). On GitHub Pages it's protected by a passcode set on first use and only sees players in that browser.
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
