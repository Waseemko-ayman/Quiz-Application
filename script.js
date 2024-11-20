/* ================================== Select Element ================================== */
let countSpan = document.querySelector(".quiz-info .count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let questionArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");

// Set options
let currentIndex = 0;
let rightAnswer = 0;

/* ============================= Create Get Data Function ============================= */
async function getQuestions() {
  try {
    let data = await fetch("html_questions.json");
    let questionsObject = await data.json();
    // Questions Count
    let qCount = questionsObject.length;

    // Create Bullets + Set Questions Count
    createBullets(qCount);

    // Add Question Data
    addQuestionData(questionsObject[currentIndex], qCount);

    // Click on Submit
    submitButton.addEventListener("click", () => {
      // Get Right Answer
      let theRightAnswer = questionsObject[currentIndex].right_answer;

      // Increase Index
      currentIndex++;

      // Check The Answer
      checkAnswer(theRightAnswer, qCount);

      // Remove Previous Question
      questionArea.innerHTML = "";
      answersArea.innerHTML = "";

      // Add Question Data
      addQuestionData(questionsObject[currentIndex], qCount);

      // Handle Bullets Classes
      handleBullets();
    })

  } catch (error) {
    console.log(error);
  }
}
getQuestions();

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
  // Create H2 Question Title
  let questionTitle = document.createElement("h2");

  // Create Question Text
  let questionText = document.createTextNode(obj.title);

  // Append Question Text To H2
  questionTitle.appendChild(questionText);

  // Append The H2 To Question Area
  questionArea.appendChild(questionTitle);

  // Create The Answers
  for (let i = 1; i <= 4; i++) {

    // Create Main Answer Div
    let mainDiv = document.createElement("div");
    // Add Class To Main Div
    mainDiv.classList.add("answer");

    // Create Radio Input
    let radioInput = document.createElement("input");
    // Add Type + name + id + Data Attribute
    radioInput.name = "question";
    radioInput.type = "radio";
    radioInput.id = `answer_${i}`;
    radioInput.dataset.answer = obj[`answer_${i}`];

    // Make First Option Selected
    if (i === 1) {
      radioInput.checked = true;
    }

    // Create Label
    let theLabel = document.createElement("label");

    // Add For Attribute
    theLabel.htmlFor = `answer_${i}`;

    // Create Lable Text
    let theLabelText = document.createTextNode(obj[`answer_${i}`]);

    // Add The Text To Label
    theLabel.appendChild(theLabelText);

    // Add input + Label To Main Div
    mainDiv.appendChild(radioInput);
    mainDiv.appendChild(theLabel);

    // Add All Divs To Answers Area
    answersArea.appendChild(mainDiv);
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