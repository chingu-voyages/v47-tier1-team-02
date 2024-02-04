/* eslint-disable no-unused-vars */
// Follows Airbnb JavaScript style guide

const intro = document.getElementById('intro');
const introForm = document.getElementById('intro-form');
const welcomePage = document.getElementById('welcome-page');
const introFormInput = document.getElementById('introForm-input');
const matrix = document.getElementById('matrix');
const checklistPage = document.getElementById('checklist-page');

checklistPage.style.display = 'none';
matrix.style.display = 'none';

// const userName = localStorage.getItem('name');

document.addEventListener('click', (e) => {
  if (e.target.id === 'start-btn') {
    welcomePage.style.display = 'none';
    introForm.style.display = 'block';
  } else if (e.target.id === 'decline-btn') {
    introForm.style.display = 'none';
    welcomePage.style.display = 'none';
    introFormInput.value = '';
    matrix.style.display = 'block';
  }
});

introForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const introFormData = new FormData(introForm);
  const inputValue = introFormData.get('user');

  localStorage.setItem('name', inputValue);

  introFormInput.value = '';
  intro.style.display = 'none';
  matrix.style.display = 'block';
});

const date = new Date();
const jsonObj = [
  {
    categoryName: 'Routine activities',
    activityTypes: [
      {
        activityName: 'Projects',
        Tasks: [
          {
            taskName: 'Ontrack',
            taskDescription: 'Create json data handling',
            days: [
              '25/01/2024',
              '23/01/2024',
              '04/02/2024',
              '22/01/2024',
            ],
            completion: [
              '23/01/2024',
              '22/01/2024',
            ],
          },
        ],
      },
    ],
  },
  {
    categoryName: 'Studying',
    activityTypes: [
      {
        activityName: 'Node js course',
        Tasks: [
          {
            taskName: 'Read bookmarked article',
            taskDescription: 'Go through all articles in bookmark',
            days: [
              'Monday',
            ],
            completion: [],
          },
        ],
      },
    ],
  },
];

function dateFormat(fDate) {
  const dd = String(fDate.getDate()).padStart(2, '0');
  const mm = String(fDate.getMonth() + 1).padStart(2, '0');
  const yyyy = fDate.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function setMonthName(mDate) {
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December',
  ];

  const monthIndex = mDate.getMonth();
  document.getElementById('month-name').innerHTML = `${months[monthIndex]}`;
}

function loadMatrix(matDate) {
  setMonthName(matDate);
  const dayNum = matDate.getDay();

  // Set date to the last Sunday to build day elements from the top
  matDate.setDate(matDate.getDate() - dayNum);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const daysContainer = document.getElementById('mobile-table');
  daysContainer.innerHTML = '';

  daysOfWeek.forEach((day) => {
    const dayDiv = document.createElement('div');

    // Division for all components of the day
    dayDiv.classList.add('days');

    const dayHeader = document.createElement('div');

    // Division for day name, date and add task button
    dayHeader.classList.add('day-header');

    const fDate = dateFormat(matDate);

    dayHeader.innerHTML = `
            <button type="button">+</button>
            <span class="day-name">${day} (${fDate})</span>
        `;

    matDate.setDate(matDate.getDate() + 1);

    const taskList = document.createElement('div');

    // Division for task name and checkbox
    taskList.classList.add('task-list');

    /*
      Find each task's day in json and check if it is same as the day of element under construction.
      If it is, add the task name under the constructed header.
    */
    const boxToTick = [];
    jsonObj.forEach((category) => {
      category.activityTypes.forEach((activityType) => {
        activityType.Tasks.forEach((task) => {
          task.days.forEach((dayN) => {
            if (dayN === day || dayN === fDate) {
              const taskElement = document.createElement('div');

              // Division for individual task name and checkbox
              taskElement.classList.add('task-element');

              // Checkbox ID has the date and name of task to prevent duplication
              const id = `${fDate}-${task.taskName}-checkbox`;

              taskElement.innerHTML = `
                  <label class="checkbox-label" for="${id}"> ${task.taskName} </label>
                  <input type="checkbox" id="${id}" name="task-checkbox" value="checked" onchange="checkboxStore('${id}')">
              `;
              taskList.appendChild(taskElement);

              // Get id of checkboxes to be ticked
              if (task.completion.includes(fDate)) {
                boxToTick.push(id);
              }
            }
          });
        });
      });
    });

    dayDiv.appendChild(dayHeader);
    dayDiv.appendChild(taskList);

    daysContainer.appendChild(dayDiv);

    // Tick all checkboxes that have a completion date in json.
    boxToTick.forEach((boxId) => {
      document.getElementById(`${boxId}`).checked = true;
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadMatrix(date);
});

/*  When the checkbox is clicked, identify the checkbox using it's id
    which is in the format <date-taskName-checkbox>.
    Match the task name of the checkbox to the one in json
    if checkbox ticked -> add the date of checkbox to json
    if checkbox unticked -> remote date from json

    Date stored in json will identify which checkboxes needs to be ticked
    Prevents other checkboxes from updating when a checkbox belonging to
    same day is updated.
*/

// eslint-disable-next-line no-unused-vars
function checkboxStore(id) {
  const boxDate = id.slice(0, 10);
  const boxName = id.slice(11, -9);

  jsonObj.forEach((category) => {
    category.activityTypes.forEach((activityType) => {
      activityType.Tasks.forEach((task) => {
        if (task.taskName === boxName) {
          const index = task.completion.indexOf(boxDate);
          if (index !== -1) {
            task.completion.splice(index, 1);
          } else {
            task.completion.push(boxDate);
          }
        }
      });
    });
  });
  localStorage.setItem('tasksJson', JSON.stringify(jsonObj));
}

// Clear the matrix table when changing week/month
function deleteChild() {
  const table = document.getElementById('mobile-table');
  while (table.firstChild) {
    table.removeChild(table.lastChild);
  }
}

// eslint-disable-next-line no-unused-vars
function prevMonth() {
  deleteChild();
  /*
    Set the date to the previous week and load matrix
    Creating the matrix puts the date on next Sunday
    so decrement 8 to get to previous week
  */
  date.setDate(date.getDate() - 8);

  loadMatrix(date);
}

// eslint-disable-next-line no-unused-vars
function nextMonth() {
  deleteChild();
  // Don't have to increment date as creating matrix puts date on next week

  loadMatrix(date);
}

// Click to display dropdown
// eslint-disable-next-line no-unused-vars
function changeMonth() {
  const dropdown = document.getElementById('months-dropdown');
  if (dropdown.style.display === 'block') {
    dropdown.style.display = 'none';
  } else {
    dropdown.style.display = 'block';
  }
}

// Select month and load matrix
// eslint-disable-next-line no-unused-vars
function goToMonth(month) {
  document.getElementById('months-dropdown').style.display = 'none';
  deleteChild();
  date.setMonth(month);
  loadMatrix(date);
}

// to get the current date and day to be displayed the Today's Checklist page
function getChecklistDay() {
  const todayDate = new Date();
  const dayIndex = String(todayDate.getDay());
  const checklistDate = dateFormat(todayDate);
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return [daysOfWeek[dayIndex], checklistDate];
}

function renderTaskToChecklist(todayDate, taskName, boxToTick) {
  const categoryPage = document.getElementById('checklist-page');
  const id = `${todayDate}-${taskName}`;
  const taskElementHtml = `
    <div id="${id}-ele" class="task-element">
        <label class="checkbox-label" for="${id}-checkbox"${id}-task"> ${taskName} </label>
        <input type="checkbox" id="${id}-checkbox-checklist" name="task-checkbox" value="checked" onchange="checkboxStore('${id}-checkbox')">
    </div>   
  `;

  categoryPage.innerHTML += taskElementHtml;

  boxToTick.forEach((boxId) => {
    // document.getElementById(`${boxId}-checkbox`).checked = true;
    document.getElementById(`${boxId}-checkbox-checklist`).checked = true;
  });
}

function findTasks() {
  const dayDate = getChecklistDay();
  const todayDay = dayDate[0];
  const todayDate = dayDate[1];
  const boxToTick = [];

  jsonObj.forEach((category) => {
    category.activityTypes.forEach((activityType) => {
      activityType.Tasks.forEach((task) => {
        task.days.forEach((dayN) => {
          if (dayN === todayDay || dayN === todayDate) {
            const id = `${todayDate}-${task.taskName}`;
            if (task.completion.includes(todayDate)) {
              boxToTick.push(id);
            }
            renderTaskToChecklist(todayDate, task.taskName, boxToTick);
          }
        });
      });
    });
  });
}

function setDayHeader(todayDay, todayDate) {
  const dayHeader = document.getElementById('day-header');
  dayHeader.innerHTML = `
    <button type="button">+</button>
    <span class="day-name">${todayDay} (${todayDate})</span>
  `;
  findTasks();
}

function getDayDate() {
  const dayDate = getChecklistDay();
  const todayDay = dayDate[0];
  const todayDate = dayDate[1];

  setDayHeader(todayDay, todayDate);
}

function backFromChecklist() {
  checklistPage.innerHTML = '';
  checklistPage.style.display = 'none';
  loadMatrix(date);
  matrix.style.display = 'block';
}

function openChecklist() {
  matrix.style.display = 'none';
  checklistPage.style.display = 'block';
  checklistPage.innerHTML = `
    <img src="images/back.png" id="back-img-checklist" onclick="backFromChecklist()">
    <h1 class="checklist-title">Today's Tasks</h1>
    <div class="day-header" id="day-header">
    </div>  
  `;
  getDayDate();
}
