export default function updEventStatus(timing, basicEvents) {
  const gameEvents = { ...basicEvents };

  console.log("Update check and apply");

  if (timing === 0) {
    console.log("game start");
  }
}
