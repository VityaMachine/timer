import formatTime from "./formatTime.js";
import updEventStatus from "./eventStatusUpdater.js";

import TIMINGS from "../data/timings.js";
import gameEventsStatus from "../data/events.js";

const startBtn = document.querySelector("#startBtn");
const stopBtn = document.querySelector("#stopBtn");
const resetBtn = document.querySelector("#resetBtn");
const displayedTimeText = document.querySelector("#displayedTime");

const DEFAULT_TIMEOUT = -30;
const STATUS = { PREPARE: "prepare", WARNING: "warning", TIMING: "timing" };

let timeText;
let mainTimer;
let gameSecond = DEFAULT_TIMEOUT;

const gameSessionEvents = { ...gameEventsStatus };
const firstTimingsArray = TIMINGS.filter((el) => el.isIncluded).map((el) => ({
  ...el,
  nextPrepareTiming: el.startTiming - el.warningSeconds - el.prepareSeconds,
  nextWarningTiming: el.startTiming - el.warningSeconds,
  nextTiming: el.startTiming,
  deleteFromArrTiming: el.startTiming + el.showLength,
}));
const activeEventsArr = [];

console.log(firstTimingsArray);

stopBtn.disabled = true;
resetBtn.disabled = true;

function startGame() {
  mainTimer = setInterval(() => {
    timeText =
      gameSecond < 0
        ? `To start ${Math.abs(gameSecond)} seconds`
        : formatTime(gameSecond);
    displayedTimeText.textContent = timeText;

    // console.log(gameSecond);

    let eventsArr = [];

    const eventsPrepareArray = firstTimingsArray
      .filter(
        (el) =>
          gameSecond >= el.nextPrepareTiming &&
          gameSecond < el.nextWarningTiming,
      )
      .map((el) => ({ ...el, status: STATUS.PREPARE }));
    const eventsWarningArray = firstTimingsArray
      .filter(
        (el) =>
          gameSecond >= el.nextWarningTiming && gameSecond < el.nextTiming,
      )
      .map((el) => ({ ...el, status: STATUS.WARNING }));
    const eventTimingArray = firstTimingsArray
      .filter(
        (el) =>
          gameSecond >= el.nextTiming && gameSecond <= el.deleteFromArrTiming,
      )
      .map((el) => ({ ...el, status: STATUS.TIMING }));

    eventsArr = [
      ...eventsPrepareArray,
      ...eventsWarningArray,
      ...eventTimingArray,
    ];

    console.log(`Second ${gameSecond}`);
    console.log(eventsArr);

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

  displayedTimeText.textContent = "999:99";
  resetBtn.disabled = true;
}

startBtn.addEventListener("click", startGame);
stopBtn.addEventListener("click", stopGame);
resetBtn.addEventListener("click", resetGame);
