import formatTime from "./formatTime.js";
import updEventStatus from "./eventStatusUpdater.js";
import cardCreator from "./cardMarkup.js";

import TIMINGS from "../data/timings.js";

const startBtn = document.querySelector("#startBtn");
const stopBtn = document.querySelector("#stopBtn");
const resetBtn = document.querySelector("#resetBtn");
const displayedTimeText = document.querySelector("#displayedTime");
const dataContainer = document.querySelector(".dataContainer");

const DEFAULT_TIMEOUT = -30;

// console.dir(dataContainer);

let timeText;
let mainTimer;
let gameSecond = DEFAULT_TIMEOUT;

const firstTimingsArray = TIMINGS.filter((el) => el.isIncluded).map((el) => ({
  ...el,
  nextPrepareTiming: el.startTiming - el.warningSeconds - el.prepareSeconds,
  nextWarningTiming: el.startTiming - el.warningSeconds,
  nextTiming: el.startTiming,
  deleteFromArrTiming: el.startTiming + el.showLength,
}));

let sessionEventsArray = [...firstTimingsArray];
let activeEventsArray = [];

stopBtn.disabled = true;
resetBtn.disabled = true;

function startGame() {
  mainTimer = setInterval(() => {
    timeText =
      gameSecond < 0
        ? `To start ${Math.abs(gameSecond)} seconds`
        : formatTime(gameSecond);
    displayedTimeText.textContent = timeText;

    const sessionData = updEventStatus(gameSecond, sessionEventsArray);

    sessionEventsArray = sessionData.newSessionArray;
    activeEventsArray = sessionData.activeEventsArr;

    const markupEventsArr = activeEventsArray.map((el) =>
      cardCreator(el.image, el.name, el.secondsToTiming),
    );
    const markupEventsHTML = markupEventsArr.join("");
    // console.log(dataContainer);
    // dataContainer.insertAdjacentHTML("beforeend", markupEventsHTML);
    dataContainer.innerHTML = markupEventsHTML;

    console.log("Second: ", gameSecond);
    console.log(sessionData);
    console.log(markupEventsHTML);

    startBtn.disabled = true;
    stopBtn.disabled = false;
    resetBtn.disabled = false;
    gameSecond++;
  }, 100);
}

function stopGame() {
  clearInterval(mainTimer);

  startBtn.disabled = false;
  stopBtn.disabled = true;
}

function resetGame() {
  stopGame();
  gameSecond = DEFAULT_TIMEOUT;

  sessionEventsArray = [...firstTimingsArray];
  activeEventsArray = [];

  displayedTimeText.textContent = "999:99";
  resetBtn.disabled = true;
}

startBtn.addEventListener("click", startGame);
stopBtn.addEventListener("click", stopGame);
resetBtn.addEventListener("click", resetGame);
