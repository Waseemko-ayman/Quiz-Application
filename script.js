/* ================================== Select Element ================================== */
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

    // Start CountDown
    countdown(5, qCount);

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

      // Show Result
      showResult(qCount);
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
  if (currentIndex < count) {
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
    questionArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

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
      }

    }, 1000);
  }
}