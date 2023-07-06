chrome.alarms.create('pomodoroTimer', {
  periodInMinutes: 1 / 60,
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'pomodoroTimer') {
    chrome.storage.local.get(
      ['timer', 'isRunning', 'minutesSetting'],
      ({ timer, isRunning, minutesSetting }) => {
        if (isRunning) {
          timer++;
          chrome.storage.local.set({
            timer,
          });
          if (timer >= minutesSetting * 60) {
            self.registration.showNotification('Pomodoro Timer', {
              body: 'Time is up!',
              icon: 'icon.png',
            });
            chrome.storage.local.set({
              isRunning: false,
            });
          }
        }
      },
    );
  }
});

chrome.storage.local.get(
  ['timer', 'isRunning', 'minutesSetting'],
  ({ timer, isRunning, minutesSetting }) => {
    if (timer === undefined) {
      chrome.storage.local.set({
        timer: 0,
      });
    }
    if (isRunning === undefined) {
      chrome.storage.local.set({
        isRunning: false,
      });
    }
    if (minutesSetting === undefined) {
      chrome.storage.local.set({
        minutesSetting: 25,
      });
    }
  },
);
