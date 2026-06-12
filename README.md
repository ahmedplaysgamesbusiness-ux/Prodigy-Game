# Arcane Math Quest

A lightweight browser game inspired by adaptive math RPGs like Prodigy.

## What it does
- Generates themed math questions in real-time (addition, subtraction, multiplication, division).
- Adapts difficulty based on player performance:
  - Every 3-answer streak increases difficulty.
  - Mistakes can reduce difficulty so learners recover confidence.
- Tracks score, streak, lives, pet XP/level, and accuracy.
- Supports mode toggles so players/teachers can focus on specific math operations.
- Includes pet companions with gameplay perks (score boost, life recovery, extra hint guidance).

## Run locally
Run the built-in Node server so `/`, `/index.html`, and refreshed browser routes all load the game instead of a Not Found page:

```bash
npm start
```

Then open `http://localhost:8000`. You can also open `index.html` directly in a browser for quick local play.
