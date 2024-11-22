/* ================================== Select Element ================================== */
let quizApp = document.querySelector(".quiz-app");
let categorys = document.querySelector(".categorys .category");
let countSpan = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let questionArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// Set options
let currentIndex = 0;
let rightAnswer = 0;
let countdownInterval;
let currentCategory;
let activeCategory = null;
let theCategorysBtn;

function createQuizLayout() {
  questionArea = document.createElement("div");
  questionArea.classList.add("quiz-area");

  answersArea = document.createElement("div");
  answersArea.classList.add("answers-area");

  submitButton = document.createElement("button");
  submitButton.classList.add("submit-button");
  submitButton.textContent = "Submit Answer";

  bullets = document.createElement("div");
  bullets.classList.add("bullets");

  bulletsSpanContainer = document.createElement("div");
  bulletsSpanContainer.classList.add("spans");

  countdownElement = document.createElement("div");
  countdownElement.classList.add("countdown");

  resultContainer = document.createElement("div");
  resultContainer.classList.add("results");

  // Add Bullets Span Container To Bullets Div
  bullets.appendChild(bulletsSpanContainer);

  // Add Count Down Element To Bullets Div
  bullets.appendChild(countdownElement);

  // Add Quiz Area To Quiz App Div
  quizApp.appendChild(questionArea);

  // Add Answer Area To Quiz App Div
  quizApp.appendChild(answersArea);

  // Add Submit Button To Quiz App Div
  quizApp.appendChild(submitButton);

  // Add Bullets Div To Quiz App Div
  quizApp.appendChild(bullets);

  // Add Results To Quiz App Div
  quizApp.appendChild(resultContainer);
}

/* ============================= Create Get Data Function ============================= */
async function getQuestions() {
  try {
    let data = await fetch("../json/html_questions.json");
    let questionsObjects = await data.json();

    // Create Category
    createCategorys(questionsObjects);

    theCategorysBtn = document.querySelectorAll(".categorys .category button");

    theCategorysBtn.forEach((button) => {
      button.addEventListener("click", (e) => {

        // Check for results
        if (resultContainer && resultContainer.innerHTML !== "") {
          resultContainer.innerHTML = "";
          resultContainer.style.padding = "";
          resultContainer.style.marginTop = "";
          resultContainer.style.backgroundColor = "";
          rightAnswer = 0;
        }

        // Check if the structure has already been created.
        if (!document.querySelector(".quiz-area")) {
          createQuizLayout(); // Create the structure only if it does not exist
        }

        // Remove Checked Class From All buttons
        theCategorysBtn.forEach((button) => {
          button.classList.remove("checked");
        });

        // Add Checked Class To The Clicked Button
        button.classList.add("checked");

        // Remove all categories except the selected ones.
        theCategorysBtn.forEach((button) => {
          if (!button.classList.contains("checked")) {
            button.style.display = "none";
          }
        });

        let selectedCategory = e.currentTarget.dataset.category;

        if (activeCategory === selectedCategory) {
          return;
        }

        // Update active class
        activeCategory = selectedCategory;
        currentIndex = 0;

        // Remove old questions and related information
        clearPreviousQuestion();

        currentCategory = questionsObjects[selectedCategory];

        // Questions Count
        let qCount = currentCategory.length;

        // Create Bullets + Set Questions Count
        createBullets(qCount);

        // Add Question Data
        addQuestionData(currentCategory[currentIndex], qCount);

        // Start CountDown
        countdown(5, qCount);

        // Click on Submit
        submitButton.addEventListener("click", () => {
          // Get Right Answer
          let theRightAnswer = currentCategory[currentIndex].right_answer;

          // Increase Index
          currentIndex++;

          // Check The Answer
          checkAnswer(theRightAnswer, qCount);

          // Remove Previous Question
          questionArea.innerHTML = "";
          answersArea.innerHTML = "";

          // Add Question Data
          addQuestionData(currentCategory[currentIndex], qCount);

          // Handle Bullets Classes
          handleBullets();

          // Start CountDown
          clearInterval(countdownInterval);
          countdown(5, qCount);

          // Show Result
          showResult(qCount);
        })
      });
    });
  } catch (error) {
    console.log(error);
  }
}
getQuestions();

/* ================ Remove Old Questions & Related Information Function =============== */
function clearPreviousQuestion() {
  questionArea.innerHTML = ""; // Remove old question
  answersArea.innerHTML = ""; // Remove old answers
  bulletsSpanContainer.innerHTML = ""; // Remove old points
  clearInterval(countdownInterval); // Stop the counter
  currentIndex = 0; // Reset index
}

/* ================================ Categorys Function ================================ */
function createCategorys(questionsObjects) {
  // Get the keys to Questions Objects
  let questionsObjectsKeys = Object.keys(questionsObjects);

  for (let i = 0; i < questionsObjectsKeys.length; i++) {
    // Create Button
    let categoryButton = document.createElement("button");
    // Add Data Attribute + innerHTML
    categoryButton.dataset.category = questionsObjectsKeys[i];
    categoryButton.innerHTML = questionsObjectsKeys[i];

    // Add Button To Categorys Div
    categorys.appendChild(categoryButton);
  }
}

/* ============================ Create The Bullets Function =========================== */
function createBullets(num) {
  countSpan.innerHTML = num;

  // Create Spans
  for (let i = 0; i < num; i++) {
    // Create Bullet
    let theBullet = document.createElement("span");

    // Check If Its First Span
    if (i === 0) {
      theBullet.classList.add("on");
    }

    // Append Bullets To Main Bullet Container
    bulletsSpanContainer.appendChild(theBullet);
  }
}

/* ============================ Add Question Data Function =========================== */
function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // Create H2 Question Title
    let questionTitle = document.createElement("h2");

    // Create Question Text
    let questionText = document.createTextNode(obj.title);

    // Append Question Text To H2
    questionTitle.appendChild(questionText);

    // Append The H2 To Question Area
    questionArea.appendChild(questionTitle);

    // Create an array containing the answers
    let answers = [
      obj.answer_1,
      obj.answer_2,
      obj.answer_3,
      obj.answer_4,
    ];

    // Randomize the Elements By Fisher-Yates Shuffle Algorithm.
    for (let i = answers.length - 1; i > 0; i--) {
      let random = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[random]] = [answers[random], answers[i]];
    }

    let defaultSelectedIndex = Math.floor(Math.random() * answers.length);

    // Create options based on the new order
    answers.forEach((answer, index) => {
      // Create Main Answer Div
      let mainDiv = document.createElement("div");
      // Add Class To Main Div
      mainDiv.classList.add("answer");

      // Create Radio Input
      let radioInput = document.createElement("input");
      // Add Type + name + id + Data Attribute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${index + 1}`;
      radioInput.dataset.answer = answer;

      // Select a random option as the default
      if (index === defaultSelectedIndex) {
        radioInput.checked = true;
      }

      // Create Label
      let theLabel = document.createElement("label");
      // Add For Attribute
      theLabel.htmlFor = `answer_${index + 1}`;

      // Create Lable Text
      let theLabelText = document.createTextNode(answer);

      // Add The Text To Label
      theLabel.appendChild(theLabelText);

      // Add input + Label To Main Div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // Add All Divs To Answers Area
      answersArea.appendChild(mainDiv);
    });
  }
}

/* ========================== Check The Right answer Function ======================== */
function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === theChoosenAnswer) {
    rightAnswer++;
  }
}

/* ============================= Handle Bullets Function ============================= */
function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);

  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.classList.add("on");
    }
  })
}

/* =============================== Show Result Function =============================== */
function showResult(count) {
  let theResult;
  if (currentIndex === count) {
    remove();

    if (rightAnswer > (count / 2) && rightAnswer < count) {
      theResult = `<span class="good">Good</span>, ${rightAnswer} From ${count} Is Good.`;
    } else if (rightAnswer === count) {
      theResult = `<span class="perfect">Perfect</span>, All Answers Is Right.`;
    } else {
      theResult = `<span class="bad">Bad</span>, ${rightAnswer} From ${count} Is Bad.`;
    }

    resultContainer.innerHTML = theResult;
    resultContainer.style.padding = "10px";
    resultContainer.style.marginTop = "10px";
    resultContainer.style.backgroundColor = "white";

    theCategorysBtn.forEach((button) => {
      button.style.display = "block";
      button.classList.remove("checked");
    });
  }
}

/* =============================== Count Down Function =============================== */
function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }

    }, 1000);
  }
}

/* ============================ Remove Elements Function ============================= */
function remove() {
  questionArea.remove();
  answersArea.remove();
  submitButton.remove();
  bullets.remove();
}