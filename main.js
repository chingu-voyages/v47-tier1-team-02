// Follows Airbnb JavaScript style guide

const intro = document.getElementById('intro');
const introForm = document.getElementById('intro-form');
const welcomePage = document.getElementById('welcome-page');
const introFormInput = document.getElementById('introForm-input');
const matrix = document.getElementById('matrix');
intro.style.display = 'none';
matrix.style.display = 'block';

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
              '02/02/2024',
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

function giveDay(iDate) {
  const dateComponents = iDate.split('/');

  const formattedDate = `${dateComponents[1]}/${dateComponents[0]}/${dateComponents[2]}`;

  // Create a Date object
  const d = new Date(formattedDate);
  const dayIndex = d.getDay();

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return daysOfWeek[dayIndex];
}

// eslint-disable-next-line no-unused-vars
function openDetail(id) {
  if (document.getElementById('detailed-desc') == null) {
    // id format - taskDate-taskName
    const taskDate = id.slice(0, 10);
    const taskName = id.slice(11);

    // To check for due date with day as well
    const day = giveDay(taskDate);

    let taskCat = ''; let taskAct = ''; let taskDesc = ''; let taskDays = '';

    jsonObj.forEach((category) => {
      category.activityTypes.forEach((activityType) => {
        activityType.Tasks.forEach((task) => {
          if (task.taskName === taskName) {
            // Prevents same task name mismatch
            if (task.days.includes(taskDate) || task.days.includes(day)) {
              taskDesc = task.taskDescription;
              taskCat = category.categoryName;
              taskAct = activityType.activityName;
              taskDays = task.days;
            }
          }
        });
      });
    });

    const overlayDesc = document.createElement('div');
    // Class overlays on top of all elements
    overlayDesc.classList.add('overlay');
    overlayDesc.setAttribute('id', 'detailed-desc');

    // Days go as separate widgets to the task description window with button to remove them
    let htmlAdd = '';
    taskDays.forEach((taskDay) => {
      htmlAdd += `
          <div id="${id}-deadline-${taskDay}-div" class="day-widget">
            <span id="${id}-deadline-${taskDay}" class="desc-element" onclick="editDesc('${id}-${taskDay}', 'deadline')">${taskDay}</span>
            <button id="${id}-deadline-${taskDay}-button" onclick="deleteDate('${id}-deadline-${taskDay}-div')">x</button>
          </div>
      `;
    });

    // On clicking any of the attributes in the description, give id (name and date) to editDesc
    // --> to self - try removing ${id} from desc item
    overlayDesc.innerHTML = `
      <div id="back-n-day">
        <img src="images/back.png" id="back-img" onclick="backFromDesc()">

        <span id="desc-day">${day} (${taskDate})</span>
      </div>

      <div id="task-desc">
        <div id="${id}-name-desc" class="desc-item">Task name : 
          <span id="${id}-name" class="desc-element" onclick="editDesc('${id}', 'name')"> ${taskName}</span>
        </div>
        <div id="${id}-deadline-desc" class="desc-item">Deadline : 
          <div id="task-days" class="task-days">
            ${htmlAdd}
          </div>
          <div id="add-day">
            <button id="add-day-button" onclick="addDay('${id}')"> + </button>
          </div>
        </div>
        <div id="${id}-category-desc" class="desc-item">Category : 
            <span id="${id}-category" class="desc-element" onclick="editDesc('${id}', 'category')"> ${taskCat}</span>
        </div>
        <div id="${id}-activity-desc" class="desc-item">Activity : 
            <span id="${id}-activity" class="desc-element" onclick="editDesc('${id}', 'activity')"> ${taskAct}</span>
        </div>
        <div id="${id}-detail-desc" class="desc-item">Description : 
            <span id="${id}-description" class="desc-element" onclick="editDesc('${id}', 'description')">${taskDesc}</span>
        </div>

        <div id="save-button-div" class="desc-item">
          <button onclick="saveDesc('${id}')">Save</button>
        <div>
      </div>
    `;
    // document.body.appendChild(overlayDesc);
    document.getElementById('matrix').appendChild(overlayDesc);
  }
}

// eslint-disable-next-line no-unused-vars
function addDay(id) {
  const addDayDiv = document.getElementById('add-day');
  addDayDiv.innerHTML = `
    <input id="day-entry" class="DateInput" type="number" placeholder="DD" min=1 max=30>
    <input id="month-entry" class="DateInput" type="number" placeholder="MM" min=1 max=12>
    <input id="year-entry" class="DateYearInput" type="number" placeholder="YYYY" min=1000 max=5000>
    <button id="add-day-submit" onclick="addDaySubmit('${id}')">Add</button>
  `;
}

// eslint-disable-next-line no-unused-vars
function addDaySubmit(id) {
  const addDayDiv = document.getElementById('add-day');
  const day = document.getElementById('day-entry').value;
  const month = document.getElementById('month-entry').value;
  const year = document.getElementById('year-entry').value;

  const dateObj = new Date(year, month, day);
  const addedDate = dateFormat(dateObj);

  const deadlineDiv = document.getElementById('task-days');
  const dayDiv = document.createElement('div');
  dayDiv.setAttribute('id', `${id}-deadline-${addedDate}-div`);
  dayDiv.classList.add('day-widget');

  dayDiv.innerHTML = `
    <span id="${id}-deadline-${addedDate}" class="desc-element fetch-text" onclick="editDesc('${id}-${addedDate}', 'deadline')">${addedDate}</span>
    <button id="${id}-deadline-${addedDate}-button" onclick="deleteDate('${id}-deadline-${addedDate}-div')">x</button>
  `;
  addDayDiv.innerHTML = '';

  deadlineDiv.appendChild(dayDiv);

  dayDiv.insertAdjacentHTML('afterend', `
    <button id="add-day-button" onclick="addDay('${id}')"> + </button>  
  `);
}

// eslint-disable-next-line no-unused-vars
function deleteDate(id) {
  const dateWidget = document.getElementById(id);
  dateWidget.remove();
}

// eslint-disable-next-line no-unused-vars
function editDesc(id, element) {
  let boxId = id;
  let textBox = null;

  // Find the element that was clicked on
  switch (element) {
    case 'name':
      boxId = `${id}-name`;
      textBox = document.getElementById(boxId);
      break;

    case 'deadline':
      boxId = `${id}-deadline`;
      textBox = document.getElementById(boxId);
      break;

    case 'category':
      boxId = `${id}-category`;
      textBox = document.getElementById(boxId);
      break;

    case 'activity':
      boxId = `${id}-activity`;
      textBox = document.getElementById(boxId);
      break;

    case 'description':
      boxId = `${id}-description`;
      textBox = document.getElementById(boxId);
      break;

    default:
      textBox = '';
      break;
  }

  // Entry box to replace the text
  const entryBox = document.createElement('input');
  entryBox.setAttribute('id', `edit-entry-${element}`);
  entryBox.type = 'text';
  entryBox.value = textBox.textContent;

  textBox.parentNode.replaceChild(entryBox, textBox);

  // On clicking away from the box, change entry box to text
  entryBox.addEventListener('blur', () => {
    textBox = document.createElement('span');
    textBox.setAttribute('id', boxId);
    textBox.onclick = editDesc.bind(null, id, element);

    textBox.textContent = entryBox.value;

    entryBox.parentNode.replaceChild(textBox, entryBox);
  });

  entryBox.focus();
}

function setListen() {
  document.querySelectorAll('.task-element').forEach((element) => {
    const id = element.id.replace('-ele', ''); // Extracting the id without the '-ele' suffix
    element.addEventListener('click', () => openDetail(id));
  });
}

// eslint-disable-next-line no-unused-vars
function backFromDesc() {
  const descWin = document.getElementById('detailed-desc');
  descWin.remove();
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
              const id = `${fDate}-${task.taskName}`;

              taskList.innerHTML = `
                <div id="${id}-ele" class="task-element">
                  <label class="checkbox-label" for="${id}-checkbox"${id}-task"> ${task.taskName} </label>
                  <input type="checkbox" id="${id}-checkbox" name="task-checkbox" value="checked" onchange="checkboxStore('${id}')">
                </div>
              `;

              // Get id of checkboxes to be ticked
              if (task.completion.includes(fDate)) {
                boxToTick.push(`${id}-checkbox`);
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
  setListen();
}

// eslint-disable-next-line no-unused-vars
function saveDesc(id) {
  const taskDate = id.slice(0, 10);
  const taskName = id.slice(11);
  const day = giveDay(taskDate);

  // Get all id of the respective element spans (they're to be clicked on and edited)
  const nameId = `${id}-name`;

  const categoryId = `${id}-category`;
  const activityId = `${id}-activity`;
  const descId = `${id}-description`;

  const updatedName = document.getElementById(nameId).textContent;
  const updatedcategory = document.getElementById(categoryId).textContent;
  const updatedactivity = document.getElementById(activityId).textContent;
  const updateddesc = document.getElementById(descId).textContent;

  let deadlineId = null;
  let checkExist = null;

  // Get days as a list of days/dates
  // const daysList = updateddeadline.split(',');

  jsonObj.forEach((category) => {
    category.activityTypes.forEach((activityType) => {
      activityType.Tasks.forEach((task) => {
        if (task.taskName === taskName) {
          // Prevents same task name mismatch
          if (task.days.includes(taskDate) || task.days.includes(day)) {
            /* eslint-disable no-param-reassign */
            task.taskName = updatedName;
            // task.days = daysList;
            task.taskDescription = updateddesc;
            category.categoryName = updatedcategory;
            activityType.activityName = updatedactivity;
            /* eslint-enable no-param-reassign */

            /*
                If task date does not exist in document, remove it from json. Element with id in the
                given format will not exist if it has previously been removed by clicking x
            */
            task.days.forEach((taskDay) => {
              deadlineId = `${id}-deadline-${taskDay}`;
              checkExist = document.getElementById(deadlineId);
              if (checkExist === null) {
                task.days.splice(task.days.indexOf(taskDay), 1);
              }
            });
          }
        }
      });
    });
  });
  // Place matrix on the task that was cliked on
  const dateComponents = taskDate.split('/');

  const formattedDate = `${dateComponents[1]}/${dateComponents[0]}/${dateComponents[2]}`;
  const d = new Date(formattedDate);

  loadMatrix(d);
  console.log(jsonObj);
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
