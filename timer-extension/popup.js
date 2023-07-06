const TIMER_KEY = 'timer';
const NAME_KEY = 'name';
const NOTIFICATION_INTERVAL_KEY = 'notification-interval';
const IS_RUNNING_KEY = 'is-running';

const timeElement = document.getElementById('time');
const nameElement = document.getElementById('name');
const timerElement = document.getElementById('timer');

const startButtonElement = document.getElementById('start');
const stopButtonElement = document.getElementById('stop');
const resetButtonElement = document.getElementById('reset');

function updateTimeElements() {
  chrome.storage.local.get([TIMER_KEY], (result) => {
    const time = result.timer ?? 0;
    timerElement.textContent = `You have spent ${time} seconds on this site`;
  });
  const currentTime = new Date().toLocaleTimeString();

  timeElement.textContent = `The time is: ${currentTime}`;
}

updateTimeElements();
setInterval(updateTimeElements, 1000);

chrome.storage.sync.get([NAME_KEY], (result) => {
  const name = result.name || 'unknown';
  nameElement.textContent = `Your name is: ${result.name}`;
});

startButtonElement.addEventListener('click', () => {
  chrome.storage.local.set({ [IS_RUNNING_KEY]: true });
});

stopButtonElement.addEventListener('click', () => {
  chrome.storage.local.set({ [IS_RUNNING_KEY]: false });
});

resetButtonElement.addEventListener('click', () => {
  chrome.storage.local.set({ [TIMER_KEY]: 0, [IS_RUNNING_KEY]: false });
});
