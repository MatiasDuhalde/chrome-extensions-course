console.log('Background script loaded');

const TIMER_KEY = 'timer';
const NAME_KEY = 'name';
const NOTIFICATION_INTERVAL_KEY = 'notification-interval';
const IS_RUNNING_KEY = 'is-running';

chrome.alarms.create({
  periodInMinutes: 1 / 60,
});

chrome.alarms.onAlarm.addListener((alarm) => {
  chrome.storage.local.get([TIMER_KEY, IS_RUNNING_KEY], (result) => {
    const time = result[TIMER_KEY] ?? 0;
    const isRunning = result[IS_RUNNING_KEY] ?? true;

    if (!isRunning) return;

    chrome.storage.local.set({ [TIMER_KEY]: time + 1 });
    chrome.action.setBadgeText({ text: `${time + 1}` });

    chrome.storage.sync.get([NOTIFICATION_INTERVAL_KEY], (result) => {
      const notificationInterval = result[NOTIFICATION_INTERVAL_KEY] ?? 1000;

      if (time % notificationInterval === 0) {
        self.registration.showNotification('Chrome Timer Extension', {
          body: `${notificationInterval} seconds have passed!`,
          icon: 'icon.png',
        });
      }
    });
  });
});
