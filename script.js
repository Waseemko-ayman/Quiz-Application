/* ================================== Select Element ================================== */
let countSpan = document.querySelector(".quiz-info .count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let questionArea = document.querySelector(".quiz-area");

/* ============================= Create Get Data Function ============================= */
let currentIndex = 0;
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
  }
}