const toggleTimerButtonElement = document.getElementById('toggle-timer-btn');
const resetTimerButtonElement = document.getElementById('reset-timer-btn');
const addTaskButtonElement = document.getElementById('add-task-btn');
const taskContainerElement = document.getElementById('task-container');
const timerElement = document.getElementById('timer');

addTaskButtonElement.addEventListener('click', addTask);

chrome.storage.local.get(['isRunning'], ({ isRunning }) => {
  toggleTimerButtonElement.textContent = isRunning ? 'Pause Timer' : 'Start Timer';
});

toggleTimerButtonElement.addEventListener('click', () => {
  chrome.storage.local.get(['isRunning'], ({ isRunning }) => {
    console.log(isRunning);
    chrome.storage.local.set(
      {
        isRunning: !isRunning,
      },
      () => {
        toggleTimerButtonElement.textContent = isRunning ? 'Start Timer' : 'Pause Timer';
      },
    );
  });
});

resetTimerButtonElement.addEventListener('click', () => {
  chrome.storage.local.set(
    {
      timer: 0,
      isRunning: false,
    },
    () => {
      toggleTimerButtonElement.textContent = 'Start Timer';
    },
  );
});

function updateTime() {
  chrome.storage.local.get(['timer', 'minutesSetting'], ({ timer, minutesSetting }) => {
    timerElement.textContent = timer;
    renderTime(timer, minutesSetting);
  });
}

function renderTime(timer, minutesSetting) {
  const remainingSeconds = minutesSetting * 60 - timer;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`;
  timerElement.textContent = `${minutesString}:${secondsString}`;
}

updateTime();
setInterval(updateTime, 1000);

let tasks = [];

chrome.storage.sync.get(['tasks'], (result) => {
  tasks = result.tasks || [];
  renderTasks();
});

function saveTasks() {
  chrome.storage.sync.set({
    tasks,
  });
}

function updateTask(newValue, index) {
  tasks[index] = newValue;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function renderTask(index) {
  const taskRowElement = document.createElement('div');
  taskRowElement.className = 'task-row';

  const textInputElement = document.createElement('input');
  textInputElement.type = 'text';
  textInputElement.placeholder = 'Enter a task...';
  textInputElement.value = tasks[index];
  textInputElement.addEventListener('change', (event) => {
    updateTask(event.target.value, index);
  });
  textInputElement.className = 'task-input';

  const deleteButtonElement = document.createElement('input');
  deleteButtonElement.type = 'button';
  deleteButtonElement.value = 'X';
  deleteButtonElement.addEventListener('click', () => {
    deleteTask(index);
  });
  deleteButtonElement.className = 'delete-button';

  taskRowElement.appendChild(textInputElement);
  taskRowElement.appendChild(deleteButtonElement);

  taskContainerElement.appendChild(taskRowElement);
}

function addTask() {
  const index = tasks.length;
  tasks.push('');
  renderTask(index);
  saveTasks();
}

function renderTasks() {
  taskContainerElement.innerHTML = '';
  tasks.forEach((task, index) => {
    renderTask(index);
  });
}
