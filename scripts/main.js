import formatTime from "./formatTime.js";
import updEventStatus from "./eventStatusUpdater.js";
import cardCreator from "./cardMarkup.js";

import TIMINGS from "../data/timings.js";

const startBtn = document.querySelector("#startBtn");
const stopBtn = document.querySelector("#stopBtn");
const resetBtn = document.querySelector("#resetBtn");
const displayedTimeText = document.querySelector("#displayedTime");
const dataContainer = document.querySelector(".dataContainer");

const DEFAULT_TIMEOUT = -60;

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

let activeVoiceObj = {
  prepareSecond: false,
  warningSeconds: false,
  prepareVoice: null,
  warningVoice: null,
};

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
      cardCreator(el.image, el.name, el.secondsToTiming, el.status),
    );

    const activePrepareStatus = activeEventsArray
      .filter((el) => el.status === "prepare")
      .map((el) => ({
        timing: el.nextPrepareTiming,
        prepareVoice: el.prepareVoice,
      }))[0];

    const activeWarningStatus = activeEventsArray
      .filter((el) => el.status === "warning")
      .map((el) => ({
        timing: el.nextWarningTiming,
        warningVoice: el.warningVoice,
      }))[0];

    if (
      !activeVoiceObj.prepareSecond &&
      activePrepareStatus &&
      activePrepareStatus.timing
    ) {
      activeVoiceObj.prepareSecond = activePrepareStatus.timing;
      activeVoiceObj.prepareVoice = activePrepareStatus.prepareVoice;
    }

    if (
      activeVoiceObj.prepareSecond &&
      activeVoiceObj.prepareSecond < gameSecond
    ) {
      activeVoiceObj.prepareSecond = false;
      activeVoiceObj.prepareVoice = null;
    }

    if (
      !activeVoiceObj.warningSeconds &&
      activeWarningStatus &&
      activeWarningStatus.timing
    ) {
      activeVoiceObj.warningSeconds = activeWarningStatus.timing;
      activeVoiceObj.warningVoice = activeWarningStatus.warningVoice;
    }

    if (
      activeVoiceObj.warningSeconds &&
      activeVoiceObj.warningSeconds < gameSecond
    ) {
      activeVoiceObj.warningSeconds = false;
      activeVoiceObj.warningVoice = null;
    }

    const prepareAudioMarkup = activeVoiceObj.prepareSecond
      ? `<audio src="${activeVoiceObj.prepareVoice}" autoplay></audio>`
      : "";

    const warningAudioMarkup = activeVoiceObj.warningSeconds
      ? `<audio src="${activeVoiceObj.warningVoice}" autoplay></audio>`
      : "";

    const audioMarkup = prepareAudioMarkup + warningAudioMarkup;

    // console.log("Second: ", gameSecond);
    // // console.log(activePrepareStatus);
    // console.log(activeVoiceObj);

    const markupEventsHTML = markupEventsArr.join("");
    dataContainer.innerHTML = markupEventsHTML + audioMarkup;

    startBtn.disabled = true;
    stopBtn.disabled = false;
    resetBtn.disabled = false;
    gameSecond++;
  }, 1000);
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
