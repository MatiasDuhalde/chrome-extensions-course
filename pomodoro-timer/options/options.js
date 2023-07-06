const minutesInputElement = document.getElementById('minutes-input');
const saveButtonElement = document.getElementById('save-button');

minutesInputElement.addEventListener('change', (event) => {
  const minutes = event.target.value;
  if (minutes < 0 || minutes > 60) {
    minutesInputElement.value = 25;
  }
  chrome.storage.sync.set({
    minutesSetting,
  });
});

saveButtonElement.addEventListener('click', () => {
  if (minutes < 0 || minutes > 60) {
    minutesInputElement.value = 25;
  }
  const minutes = minutesInputElement.value;
  chrome.storage.local.set({
    minutesSetting: minutes,
    timer: 0,
    isRunning: false,
  });
});

chrome.storage.local.get(['minutesSetting'], ({ minutesSetting }) => {
  minutesInputElement.value = minutesSetting ?? 25;
});
