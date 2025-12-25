// Quiz App - SPA-style with theme toggle and improved UI
// Questions array: each object contains question text, options array, and index of correct answer
const questions = [
	{
		question: "What is the capital of France?",
		options: ["Paris", "Berlin", "Rome", "Madrid"],
		correctAnswerIndex: 0
	},
	{
		question: "Which language runs in a web browser?",
		options: ["Python", "C++", "JavaScript", "Java"],
		correctAnswerIndex: 2
	},
	{
		question: "Which HTML tag is used to define an unordered list?",
		options: ["<ol>", "<ul>", "<li>", "<dl>"],
		correctAnswerIndex: 1
	},
	{
		question: "Which company developed the React library?",
		options: ["Google", "Microsoft", "Apple", "Facebook"],
		correctAnswerIndex: 3
	},
	{
		question: "What does CSS stand for?",
		options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style Syntax", "Colorful Style Sheets"],
		correctAnswerIndex: 0
	}
];

// State variables
let currentQuestionIndex = 0;
let score = 0;
let selectedOptionIndex = null;

// Page elements
const pageHome = document.getElementById("page-home");
const pageQuiz = document.getElementById("page-quiz");
const pageResults = document.getElementById("page-results");

// Quiz elements (inside quiz page)
const questionTextEl = document.getElementById("questionText");
const optionsListEl = document.getElementById("optionsList");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const quizCard = document.getElementById("quizCard");
const progressEl = document.getElementById("progress");

// Results elements (on results page)
const finalScoreText = document.getElementById("finalScoreText");
const restartBtn = document.getElementById("restartBtn");
const backHomeBtn = document.getElementById("backHomeBtn");

// Controls
const startBtn = document.getElementById("startBtn");
const navButtons = document.querySelectorAll(".nav-btn");
const themeToggle = document.getElementById("themeToggle");

// Simple SPA page switcher
function showPage(pageId) {
	[pageHome, pageQuiz, pageResults].forEach((p) => {
		if (!p) return;
		if (p.id === pageId) {
			p.hidden = false;
			p.classList.add("active");
		} else {
			p.hidden = true;
			p.classList.remove("active");
		}
	});
	// update focus for accessibility
	const active = document.getElementById(pageId);
	if (active) {
		const focusable = active.querySelector("button, [tabindex], a");
		if (focusable) focusable.focus();
	}
}

// Render the current question and options
function renderQuestion() {
	// Reset selection
	selectedOptionIndex = null;
	nextBtn.disabled = true;

	// Add fade-out then fade-in for smooth transition
	quizCard.classList.add("fade-out");
	setTimeout(() => {
		const current = questions[currentQuestionIndex];
		questionTextEl.textContent = `${currentQuestionIndex + 1}. ${current.question}`;

		// Clear previous options
		optionsListEl.innerHTML = "";

		// Render options
		current.options.forEach((optionText, idx) => {
			const li = document.createElement("li");
			li.className = "option";
			li.setAttribute("role", "listitem");
			li.tabIndex = 0; // make focusable for keyboard users
			li.dataset.index = idx;

			// Hidden radio for accessibility
			const radio = document.createElement("input");
			radio.type = "radio";
			radio.name = "quizOption";
			radio.id = `opt-${idx}`;
			radio.tabIndex = -1;

			const label = document.createElement("div");
			label.className = "option-label";
			label.textContent = optionText;

			li.appendChild(radio);
			li.appendChild(label);

			// Click handler for selecting option
			li.addEventListener("click", () => {
				selectOption(idx, li);
			});

			// Keyboard handler (Enter or Space to select)
			li.addEventListener("keydown", (e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					selectOption(idx, li);
				}
			});

			optionsListEl.appendChild(li);
		});

		// Update progress display
		if (progressEl) {
			progressEl.textContent = `Question ${currentQuestionIndex + 1} / ${questions.length}`;
		}

		// If last question, hide Next and show Submit
		if (currentQuestionIndex === questions.length - 1) {
			nextBtn.hidden = true;
			submitBtn.hidden = false;
		} else {
			nextBtn.hidden = false;
			submitBtn.hidden = true;
		}

		quizCard.classList.remove("fade-out");
		quizCard.classList.add("fade-in");

		// Remove fade-in class after animation completes to keep transitions consistent
		setTimeout(() => quizCard.classList.remove("fade-in"), 400);
	}, 180);
}

// Handle option selection
function selectOption(index, optionElement) {
	// Deselect any previous
	document.querySelectorAll(".option").forEach((el) => {
		el.classList.remove("selected");
		const input = el.querySelector('input[type="radio"]');
		if (input) input.checked = false;
		el.setAttribute("aria-pressed", "false");
	});

	// Mark selected
	optionElement.classList.add("selected");
	const input = optionElement.querySelector('input[type="radio"]');
	if (input) input.checked = true;
	optionElement.setAttribute("aria-pressed", "true");

	selectedOptionIndex = index;
	nextBtn.disabled = false;
}

// Move to next question
function handleNext() {
	// Prevent going forward if nothing selected (button should be disabled, but double-check)
	if (selectedOptionIndex === null) return;

	// Update score if correct
	if (selectedOptionIndex === questions[currentQuestionIndex].correctAnswerIndex) {
		score++;
	}

	currentQuestionIndex++;
	renderQuestion();
}

// Submit quiz and show results
function handleSubmit() {
	// Ensure option selected
	if (selectedOptionIndex === null) return;

	// Final score update
	if (selectedOptionIndex === questions[currentQuestionIndex].correctAnswerIndex) {
		score++;
	}

	showResults();
}

// Display results: navigate to results page and show final score
function showResults() {
	finalScoreText.textContent = `You scored ${score} out of ${questions.length}`;
	showPage("page-results");
}

// Reset all state and restart quiz
function restartQuiz() {
	currentQuestionIndex = 0;
	score = 0;
	selectedOptionIndex = null;
	showPage("page-quiz");
	renderQuestion();
}

// Theme toggle (persists to localStorage)
function applyTheme(theme) {
	if (theme === "dark") {
		document.documentElement.classList.add("dark");
		themeToggle.setAttribute("aria-pressed", "true");
	} else {
		document.documentElement.classList.remove("dark");
		themeToggle.setAttribute("aria-pressed", "false");
	}
	localStorage.setItem("quickQuizTheme", theme);
}

function initThemeFromStorage() {
	const preferred = localStorage.getItem("quickQuizTheme") || "dark";
	applyTheme(preferred);
}

// Wire up buttons and navigation
nextBtn.addEventListener("click", handleNext);
submitBtn.addEventListener("click", handleSubmit);
restartBtn.addEventListener("click", restartQuiz);
backHomeBtn.addEventListener("click", () => showPage("page-home"));

startBtn.addEventListener("click", () => {
	// Reset quiz state and immediately open quiz page and render first question
	currentQuestionIndex = 0;
	score = 0;
	selectedOptionIndex = null;
	showPage("page-quiz");
	// Render immediately so the quiz appears right after clicking Start
	renderQuestion();
});

navButtons.forEach((btn) => {
	btn.addEventListener("click", () => {
		const target = btn.dataset.target;
		if (target) showPage(target);
	});
});

themeToggle.addEventListener("click", () => {
	const isDark = document.documentElement.classList.contains("dark");
	applyTheme(isDark ? "light" : "dark");
});

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
	initThemeFromStorage();
	showPage("page-home");
});


