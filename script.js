const questions = [
  {
    question: "What is the capital of France?",
    choices: ["Paris", "London", "Berlin", "Madrid"],
    answer: "Paris",
  },
  {
    question: "What is the highest mountain in the world?",
    choices: ["Everest", "Kilimanjaro", "Denali", "Matterhorn"],
    answer: "Everest",
  },
  {
    question: "What is the largest country by area?",
    choices: ["Russia", "China", "Canada", "United States"],
    answer: "Russia",
  },
  {
    question: "Which is the largest planet in our solar system?",
    choices: ["Earth", "Jupiter", "Mars"],
    answer: "Jupiter",
  },
  {
    question: "What is the capital of Canada?",
    choices: ["Toronto", "Montreal", "Vancouver", "Ottawa"],
    answer: "Ottawa",
  },
];

const questionsElement = document.getElementById("questions");
const submitButton = document.getElementById("submit");
const scoreElement = document.getElementById("score");

// Load previously selected answers (if any) from sessionStorage
let userAnswers = JSON.parse(sessionStorage.getItem("progress")) || {};

// Display the quiz questions and choices
function renderQuestions() {
  questionsElement.innerHTML = ""; // Clear if already rendered

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const questionContainer = document.createElement("div");

    const questionText = document.createElement("p");
    questionText.textContent = `${i + 1}. ${question.question}`;
    questionContainer.appendChild(questionText);

    for (let j = 0; j < question.choices.length; j++) {
      const choice = question.choices[j];

      const label = document.createElement("label");
      const choiceInput = document.createElement("input");
      choiceInput.type = "radio";
      choiceInput.name = `question-${i}`;
      choiceInput.value = choice;

      // Restore checked state from sessionStorage
      if (userAnswers[`question-${i}`] === choice) {
        choiceInput.checked = true;
      }

      // Save selection on change
      choiceInput.addEventListener("change", () => {
        userAnswers[`question-${i}`] = choice;
        sessionStorage.setItem("progress", JSON.stringify(userAnswers));
      });

      label.appendChild(choiceInput);
      label.append(` ${choice}`);
      questionContainer.appendChild(label);
      questionContainer.appendChild(document.createElement("br"));
    }

    questionsElement.appendChild(questionContainer);
  }
}

// Handle quiz submission
function submitQuiz() {
  let score = 0;

  questions.forEach((question, index) => {
    const selected = userAnswers[`question-${index}`];
    if (selected === question.answer) {
      score++;
    }
  });

  scoreElement.textContent = `Your score is ${score} out of ${questions.length}.`;

  // Save final score in localStorage
  localStorage.setItem("score", score);
}

// On page load, render the questions
renderQuestions();

// If score was previously submitted and stored, show it
const savedScore = localStorage.getItem("score");
if (savedScore !== null) {
  scoreElement.textContent = `Your score is ${savedScore} out of ${questions.length}.`;
}

// Submit button event
submitButton.addEventListener("click", submitQuiz);

describe('Quiz Application Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000'); // Adjust to your app's URL or local path
    cy.clearLocalStorage();
    cy.window().then((win) => win.sessionStorage.clear());
  });

  it('✅ Test 1: Checking Questions and UI Elements', () => {
    cy.get("div#questions").should("exist");
    cy.get("div#questions > div").should("have.length", 5); // 5 questions
    cy.get("input[type='radio']").should('have.length.at.least', 15); // Multiple radio buttons
    cy.get("button#submit").should("exist");
    cy.get("div#score").should("be.empty");
  });

  it('✅ Test 2: Checking Session Storage (Progress Save)', () => {
    // Select answers for questions 0 and 1
    cy.get("input[name='question-0']").eq(0).check({ force: true }); // e.g., Paris
    cy.get("input[name='question-1']").eq(2).check({ force: true }); // e.g., Denali

    // Reload page
    cy.reload();

    // Verify that answers are still selected
    cy.get("input[name='question-0']").eq(0).should("be.checked");
    cy.get("input[name='question-1']").eq(2).should("be.checked");

    // Check sessionStorage content
    cy.window().then((win) => {
      const progress = JSON.parse(win.sessionStorage.getItem("progress"));
      expect(progress).to.have.property("question-0");
      expect(progress).to.have.property("question-1");
    });
  });

  it('✅ Test 3: Final Score Calculation & Local Storage Check', () => {
    const correctAnswers = {
      0: "Paris",
      1: "Everest",
      2: "Russia",
      3: "Jupiter",
      4: "Ottawa"
    };

    // Select correct answers
    Object.entries(correctAnswers).forEach(([qIndex, answer]) => {
      cy.get(`input[name='question-${qIndex}'][value="${answer}"]`).check({ force: true });
    });

    // Submit the quiz
    cy.get("button#submit").click();

    // Check that the score is displayed correctly
    cy.get("div#score").should("contain", "Your score is 5 out of 5");

    // Check that score is saved in localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem("score")).to.eq("5");
    });
  });

  it('✅ Edge Case: Partial Submission', () => {
    // Only answer one question
    cy.get("input[name='question-0'][value='Paris']").check({ force: true });
    cy.get("button#submit").click();

    // Verify partial score
    cy.get("div#score").should("contain", "Your score is 1 out of 5");
  });

  it('✅ Edge Case: Refresh After Submit Shows Score', () => {
    // Submit answer
    cy.get("input[name='question-0'][value='Paris']").check({ force: true });
    cy.get("button#submit").click();

    // Reload and verify score still shows
    cy.reload();
    cy.get("div#score").should("contain", "Your score is");
  });
});

