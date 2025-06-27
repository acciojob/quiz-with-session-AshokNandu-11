// Get references to DOM elements that will be manipulated
const questionsElement = document.getElementById("questions");
const submitButton = document.getElementById("submit");
const scoreElement = document.getElementById("score");

// Quiz data - Array of question objects with their properties
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

// Initialize userAnswers array from sessionStorage or create empty array if none exists
// sessionStorage persists data for the duration of the page session but is cleared when the page is closed
let userAnswers = JSON.parse(sessionStorage.getItem("progress")) || [];

// Display the quiz questions and choices
function renderQuestions() {
  // Loop through each question in the questions array
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];

    // Create a container element for each question
    const questionElement = document.createElement("div");

    // Add the question text to the container
    const questionText = document.createTextNode(question.question);
    questionElement.appendChild(questionText);

    // Loop through each choice for the current question
    for (let j = 0; j < question.choices.length; j++) {
      const choice = question.choices[j];

      // Create a radio button for each choice
      const choiceElement = document.createElement("input");
      choiceElement.setAttribute("type", "radio");
      choiceElement.setAttribute("name", `question-${i}`);
      choiceElement.setAttribute("value", choice);

      // If user previously selected this choice, check the radio button
      if (userAnswers[i] === choice) {
        choiceElement.setAttribute("checked", true);
      }

      // Add change event listener to save the user's selection to sessionStorage
      choiceElement.addEventListener("change", (event) => {
        const selectedValue = event.target.value;
        userAnswers[i] = selectedValue;
        // Save progress to sessionStorage so user can continue later if they refresh the page
        sessionStorage.setItem("progress", JSON.stringify(userAnswers));
      });

      // Add the choice radio button and text to the question container
      const choiceText = document.createTextNode(choice);
      questionElement.appendChild(choiceElement);
      questionElement.appendChild(choiceText);
    }

    // Add the completed question container to the questions element in the DOM
    questionsElement.appendChild(questionElement);
  }
}

// Call the function to display questions when the page loads
renderQuestions();

// Function to calculate and display the user's score
function displayScore() {
  let score = 0;

  // Compare each user answer with the correct answer
  questions.forEach((question, index) => {
    if (userAnswers[index] === question.answer) {
      score++;
    }
  });

  // Display the score to the user
  scoreElement.textContent = `Your score is ${score} out of ${questions.length}.`;

  // Save the score to localStorage for persistence across browser sessions
  localStorage.setItem("score", score);
}

// Add click event listener to the submit button to calculate and display the score
submitButton.addEventListener("click", displayScore);