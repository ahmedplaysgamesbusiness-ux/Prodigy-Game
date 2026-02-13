# Arcane Math Quest

A lightweight browser game inspired by adaptive math RPGs like Prodigy.

## What it does
- Generates themed math questions in real-time (addition, subtraction, multiplication, division).
- Adapts difficulty based on player performance:
  - Every 3-answer streak increases difficulty.
  - Mistakes can reduce difficulty so learners recover confidence.
- Tracks score, streak, lives, and accuracy.
- Supports mode toggles so players/teachers can focus on specific math operations.

## Run locally
Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
