const STATUS = { PREPARE: "prepare", WARNING: "warning", TIMING: "timing" };

export default function updEventStatus(timing, eventsArray) {
  let activeEventsArr = [];

  const eventsPrepareArray = eventsArray
    .filter(
      (el) => timing >= el.nextPrepareTiming && timing < el.nextWarningTiming,
    )
    .map((el) => ({ ...el, status: STATUS.PREPARE }));
  const eventsWarningArray = eventsArray
    .filter((el) => timing >= el.nextWarningTiming && timing < el.nextTiming)
    .map((el) => ({ ...el, status: STATUS.WARNING }));
  const eventTimingArray = eventsArray
    .filter((el) => timing >= el.nextTiming && timing <= el.deleteFromArrTiming)
    .map((el) => ({ ...el, status: STATUS.TIMING }));

  activeEventsArr = [
    ...eventsPrepareArray,
    ...eventsWarningArray,
    ...eventTimingArray,
  ].map((el) => ({
    ...el,
    secondsToTiming:
      el.nextTiming - timing >= 0 ? el.nextTiming - timing : null,
  }));

  const newSessionArray = eventsArray
    .map((el) => ({
      ...el,
      nextPrepareTiming:
        timing > el.deleteFromArrTiming
          ? el.nextPrepareTiming + el.period
          : el.nextPrepareTiming,
      nextWarningTiming:
        timing > el.deleteFromArrTiming
          ? el.nextWarningTiming + el.period
          : el.nextWarningTiming,
      nextTiming:
        timing > el.deleteFromArrTiming
          ? el.nextTiming + el.period
          : el.nextTiming,
      deleteFromArrTiming:
        timing > el.deleteFromArrTiming
          ? el.deleteFromArrTiming + el.period
          : el.deleteFromArrTiming,
    }))
    .map((el) => ({
      ...el,
      nextPrepareTiming:
        el.id === 2 && timing > 4 * 60 + 5 ? null : el.nextPrepareTiming,
      nextWarningTiming:
        el.id === 2 && timing > 4 * 60 + 5 ? null : el.nextWarningTiming,
      nextTiming: el.id === 2 && timing > 4 * 60 + 5 ? null : el.nextTiming,
      deleteFromArrTiming:
        el.id === 2 && timing > 4 * 60 + 5 ? null : el.deleteFromArrTiming,
    }));

  return {
    activeEventsArr,
    newSessionArray,
  };
}
