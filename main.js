// Follows Airbnb JavaScript style guide

const intro = document.getElementById('intro');
const introForm = document.getElementById('intro-form');
const welcomePage = document.getElementById('welcome-page');
const introFormInput = document.getElementById('introForm-input');
const matrix = document.getElementById('matrix');

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

function dateFormat(date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function setMonthName(date) {
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December',
  ];

  const monthIndex = date.getMonth();
  document.getElementById('month-name').innerHTML = `${months[monthIndex]}`;
}

function loadMatrix(date) {
  setMonthName(date);
  const dayNum = date.getDay();

  // Set date to the last Sunday to build day elements from the top
  date.setDate(date.getDate() - dayNum);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const daysContainer = document.getElementById('mobile-table');

  daysOfWeek.forEach((day) => {
    const dayDiv = document.createElement('div');

    // Division for all components of the day
    dayDiv.classList.add('days');

    const dayHeader = document.createElement('div');

    // Division for day name, date and add task button
    dayHeader.classList.add('day-header');

    const fDate = dateFormat(date);

    dayHeader.innerHTML = `
            <button type="button">+</button>
            <span class="day-name">${day} (${fDate})</span>
        `;

    date.setDate(date.getDate() + 1);

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

const date = new Date();

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
  // console.log(jsonObj);
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




// the button will render the new tasks added to local storage from the category page on the checklist page
document.getElementById("checklist-add-btn").addEventListener('click', () => {
    renderTasksToChecklist()
})

//to render the Checklist page upon loading the page

if(window.location.href === 'category.html') {
    document.addEventListener('DOMContentLoaded', renderChecklist)
}

//to get the current date and day to be displayed the Today's Checklist page
function getChecklistDay() {
    const dayIndex = String(date.getDay())
    const checklistDate = dateFormat(date)
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return ` <h2 class="checklist-day">${daysOfWeek[dayIndex]}(${checklistDate})</h2>`;
}

const today = getChecklistDay()

//to render the Checklist page with the current date and day plus the tasks added to the local storage
function renderChecklist() {
    const checklistDate = document.getElementById('checklist-date')
    checklistDate.innerHTML = `${today}`
    renderTasksToChecklist()
}

// get the tasks added to the category page to the local storage to be used in the checklist page
function getTasksTochecklist(taskName, taskDate, taskId) {
    const checklistItems = JSON.parse(localStorage.getItem('checklistItems') || "[]");
    const checklistObj = {
        name: taskName,
        date: taskDate,
        id: Math.random().toString(16).slice(2),
    }
    checklistItems.push(checklistObj)
    localStorage.setItem('checklistItems', JSON.stringify(checklistItems))
}


const todaysDate = dateFormat(date)

// get the tasks from the local storage to the checklist page

function renderTasksToChecklist() {
    const savedTasks = JSON.parse(localStorage.getItem('checklistItems') || "[]");
    const checklistContainer = document.getElementById('checklist-container')
    let checklistHtml = savedTasks.map(task => {
        // only show today's tasks
        if (task.date === todaysDate) {
            return `
            <div class="checklist-task">
            <label for="${task.id}" class="checklist-name">${task.name}</label>
            <input type="checkbox" id="${task.id}" name="${task.name}" />
            </div>
            `
        }
    }).join('');
    checklistContainer.innerHTML = checklistHtml
    const checkboxes = document.querySelectorAll('.checklist-container input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.addEventListener('click', handleCheck));
}


function handleCheck(e) {
    const savedTasks = JSON.parse(localStorage.getItem('checklistItems') || "[]");
    // if the checkbox is checked then the task will be removed from the local storage and the checklist page 
    if (document.getElementById(e.target.id).checked) {
        savedTasks.filter(x => x.id === e.target.id).map(tasks => {
            savedTasks.pop(tasks)
            return savedTasks
        })
    }
    localStorage.setItem('checklistItems', JSON.stringify(savedTasks))
    location.reload();
}
