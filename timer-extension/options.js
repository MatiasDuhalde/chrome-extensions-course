const TIMER_KEY = 'timer';
const NAME_KEY = 'name';
const NOTIFICATION_INTERVAL_KEY = 'notification-interval';

const nameInputElement = document.getElementById('name-input');
const timeInputElement = document.getElementById('time-input');
const buttonElement = document.getElementById('save-btn');

buttonElement.addEventListener('click', () => {
  const name = nameInputElement.value;
  const notificationTime = timeInputElement.value;

  console.log('Saving options...');

  chrome.storage.sync.set(
    {
      [NAME_KEY]: name,
      [NOTIFICATION_INTERVAL_KEY]: notificationTime,
    },
    () => {
      console.log('Options saved successfully!');
    },
  );
});

chrome.storage.sync.get([NAME_KEY, NOTIFICATION_INTERVAL_KEY], (result) => {
  nameInputElement.value = result[NAME_KEY] ?? 'Unknown';
  timeInputElement.value = result[NOTIFICATION_INTERVAL_KEY] ?? 1000;
});
