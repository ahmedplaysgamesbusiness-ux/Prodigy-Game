const pets = {
  dragon: {
    name: "🐉 Ember Dragon",
    perk: "Bonus score on streak answers",
  },
  fox: {
    name: "🦊 Logic Fox",
    perk: "Regain a life every 5 correct answers",
  },
  owl: {
    name: "🦉 Sage Owl",
    perk: "Shows extra hint guidance",
  },
};

const state = {
  score: 0,
  streak: 0,
  lives: 3,
  correct: 0,
  total: 0,
  difficulty: 1,
  current: null,
  pet: "dragon",
  petXp: 0,
  petLevel: 1,
};

const el = {
  score: document.getElementById("score"),
  streak: document.getElementById("streak"),
  lives: document.getElementById("lives"),
  accuracy: document.getElementById("accuracy"),
  difficulty: document.getElementById("difficultyLabel"),
  questionText: document.getElementById("questionText"),
  questionHint: document.getElementById("questionHint"),
  feedback: document.getElementById("feedback"),
  form: document.getElementById("answerForm"),
  input: document.getElementById("answerInput"),
  history: document.getElementById("historyList"),
  restart: document.getElementById("restartBtn"),
  overPanel: document.getElementById("gameOverPanel"),
  finalSummary: document.getElementById("finalSummary"),
  petSelect: document.getElementById("petSelect"),
  petName: document.getElementById("petName"),
  petLevel: document.getElementById("petLevel"),
  petXp: document.getElementById("petXp"),
};

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function selectedModes() {
  const checked = [...document.querySelectorAll("#modePanel input:checked")].map((x) => x.value);
  return checked.length ? checked : ["add"];
}

function petHintTail() {
  if (state.pet === "owl") {
    return " | Owl tip: estimate first, then compute exactly.";
  }
  return "";
}

function makeQuestion() {
  const modes = selectedModes();
  const op = modes[rand(0, modes.length - 1)];
  const cap = 10 + state.difficulty * 8;
  const spice = Math.min(4, Math.floor(state.difficulty / 2));

  let a = rand(1, cap);
  let b = rand(1, cap);
  let answer;
  let text;
  let hint;

  if (op === "add") {
    answer = a + b + rand(0, spice);
    text = `A wizard combines ${a} + ${b} + ${answer - a - b}`;
    hint = "Add in chunks to move faster.";
  } else if (op === "sub") {
    if (b > a) [a, b] = [b, a];
    answer = a - b;
    text = `A shield loses ${b} energy from ${a}. What's left?`;
    hint = "Big number minus small number.";
  } else if (op === "mul") {
    a = rand(2, Math.max(4, Math.floor(cap / 3)));
    b = rand(2, 4 + spice);
    answer = a * b;
    text = `${a} dragons each guard ${b} gems. Total gems?`;
    hint = "Multiplication = repeated addition.";
  } else {
    b = rand(2, 6 + spice);
    answer = rand(2, Math.max(4, Math.floor(cap / b)));
    a = answer * b;
    text = `${a} mana crystals shared by ${b} heroes each gets?`;
    hint = "Division is the opposite of multiplication.";
  }

  state.current = { answer, text, hint };
  el.questionText.textContent = text;
  el.questionHint.textContent = `${hint}${petHintTail()}`;
  el.input.value = "";
  el.input.focus();
}

function updateHud() {
  el.score.textContent = state.score;
  el.streak.textContent = state.streak;
  el.lives.textContent = state.lives;
  el.difficulty.textContent = state.difficulty;
  const accuracy = state.total ? Math.round((state.correct / state.total) * 100) : 0;
  el.accuracy.textContent = `${accuracy}%`;
  el.petName.textContent = pets[state.pet].name;
  el.petLevel.textContent = state.petLevel;
  el.petXp.textContent = state.petXp;
}

function addHistory(msg) {
  const li = document.createElement("li");
  li.textContent = msg;
  el.history.prepend(li);
  while (el.history.children.length > 8) {
    el.history.removeChild(el.history.lastChild);
  }
}

function adaptDifficulty(isCorrect) {
  if (isCorrect) {
    if (state.streak > 0 && state.streak % 3 === 0) state.difficulty += 1;
  } else if (state.difficulty > 1 && state.streak === 0) {
    state.difficulty -= 1;
  }
}

function addPetXp() {
  state.petXp += 1;
  if (state.petXp >= 5) {
    state.petXp = 0;
    state.petLevel += 1;
    addHistory(`⭐ ${pets[state.pet].name} reached level ${state.petLevel}!`);
  }
}

function applyPetPerks(isCorrect) {
  if (!isCorrect) return;

  if (state.pet === "dragon" && state.streak >= 2) {
    state.score += 2;
  }

  if (state.pet === "fox" && state.correct > 0 && state.correct % 5 === 0 && state.lives < 5) {
    state.lives += 1;
    addHistory("🧡 Logic Fox restored 1 life!");
  }
}

function checkAnswer(rawInput) {
  const guess = Number(rawInput);
  const correct = Number(state.current.answer);
  const isCorrect = Math.abs(guess - correct) < 0.00001;

  state.total += 1;

  if (isCorrect) {
    state.correct += 1;
    state.streak += 1;
    const bonus = 10 + state.difficulty * 2 + state.streak;
    state.score += bonus;
    addPetXp();
    applyPetPerks(true);
    el.feedback.textContent = `Correct! +${bonus} points.`;
    el.feedback.className = "feedback good";
    addHistory(`✅ ${state.current.text} → ${correct}`);
  } else {
    state.streak = 0;
    state.lives -= 1;
    el.feedback.textContent = `Not quite. Correct answer: ${correct}`;
    el.feedback.className = "feedback bad";
    addHistory(`❌ ${state.current.text} → ${correct}`);
  }

  adaptDifficulty(isCorrect);
  updateHud();

  if (state.lives <= 0) {
    endGame();
  } else {
    makeQuestion();
  }
}

function endGame() {
  el.overPanel.classList.remove("hidden");
  el.form.classList.add("hidden");
  const accuracy = state.total ? Math.round((state.correct / state.total) * 100) : 0;
  el.finalSummary.textContent = `Final score: ${state.score} | Accuracy: ${accuracy}% | Peak difficulty: ${state.difficulty} | Pet level: ${state.petLevel}`;
}

function restartGame() {
  Object.assign(state, {
    score: 0,
    streak: 0,
    lives: 3,
    correct: 0,
    total: 0,
    difficulty: 1,
    current: null,
    petXp: 0,
    petLevel: 1,
  });

  el.history.innerHTML = "";
  el.feedback.textContent = "";
  el.feedback.className = "feedback";
  el.form.classList.remove("hidden");
  el.overPanel.classList.add("hidden");
  updateHud();
  makeQuestion();
}

el.form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!state.current) return;
  checkAnswer(el.input.value);
});

el.restart.addEventListener("click", restartGame);
document.querySelectorAll("#modePanel input").forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    addHistory("🔧 Topic settings updated.");
    makeQuestion();
  });
});

el.petSelect.addEventListener("change", (event) => {
  state.pet = event.target.value;
  addHistory(`🐾 Companion set to ${pets[state.pet].name}.`);
  updateHud();
  makeQuestion();
});

updateHud();
makeQuestion();
