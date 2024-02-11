/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
// Follows Airbnb JavaScript style guide

const intro = document.getElementById('intro');
const introForm = document.getElementById('intro-form');
const welcomePage = document.getElementById('welcome-page');
const introFormInput = document.getElementById('introForm-input');
const matrix = document.getElementById('matrix');
const checklistPage = document.getElementById('checklist-page');
const categoryPage = document.getElementById('category-page');
const settingsPage = document.getElementById('settings-page');
const header = document.querySelector('header');

if (localStorage.getItem('taskData') === null) {
  header.style.display = 'none';
  checklistPage.style.display = 'none';
  categoryPage.style.display = 'none';
  matrix.style.display = 'none';
} else {
  intro.style.display = 'none';
  introForm.style.display = 'none';
  categoryPage.style.display = 'none';
}
settingsPage.style.display = 'none';

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
    header.style.display = 'block';
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
  header.style.display = 'block';
});

const date = new Date();
let jsonObj = [];
let jsonString = null;

if (localStorage.getItem('taskData')) {
  jsonString = localStorage.getItem('taskData');
  jsonObj = JSON.parse(jsonString);
}

// Convert date object to DD/MM/YYYY string format
function dateFormat(fDate) {
  const dd = String(fDate.getDate()).padStart(2, '0');
  const mm = String(fDate.getMonth() + 1).padStart(2, '0');
  const yyyy = fDate.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// Update the name of month in dropdown box whenever week change results in month change
function setMonthName(mDate) {
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December',
  ];

  const monthIndex = mDate.getMonth();
  // Drop down box
  document.getElementById('month-name').innerHTML = `${months[monthIndex]}`;
}

// Return day of DD/MM/YYYY
function giveDay(iDate) {
  const dateComponents = iDate.split('/');

  const formattedDate = `${dateComponents[1]}/${dateComponents[0]}/${dateComponents[2]}`;

  const d = new Date(formattedDate);
  const dayIndex = d.getDay();

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return daysOfWeek[dayIndex];
}

// To open task description page when task element is clicked on
// eslint-disable-next-line no-unused-vars
function openDetail(id) {
  if (document.getElementById('detailed-desc') == null) {
    // id format -> taskDate-taskName
    const taskDate = id.slice(0, 10);

    const taskName = id.slice(11).split('-')[0];

    const detailId = `${taskDate}-${taskName}`;

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
          <div id="${detailId}-deadline-${taskDay}-div" class="day-widget">
            <span id="${detailId}-deadline-${taskDay}" class="desc-element date-widget">${taskDay}</span>
            <button id="${detailId}-deadline-${taskDay}-button" onclick="deleteDate('${detailId}-deadline-${taskDay}-div')">x</button>
          </div>
      `;
    });

    // On clicking any of the attributes in the description, give id (name and date) to editDesc
    overlayDesc.innerHTML = `
      <div id="back-n-day">
        <img src="images/back.png" id="back-img" onclick="backFromDesc()">

        <span id="desc-day">${day} (${taskDate})</span>
      </div>

      <div id="task-desc">
        <div id="name-desc" class="desc-item">Task name : 
          <span id="${detailId}-name" class="desc-element" onclick="editDesc('${detailId}', 'name')"> ${taskName}</span>
        </div>
        <div id="deadline-desc" class="desc-item">Deadline : 
          <div id="task-days" class="task-days">
            ${htmlAdd}
          </div>
          <div id="add-day">
            <button id="add-day-button" onclick="addDay('${detailId}')"> + </button>
          </div>
        </div>
        <div id="category-desc" class="desc-item">Category : 
            <span id="${detailId}-category" class="desc-element" onclick="editDesc('${detailId}', 'category')"> ${taskCat}</span>
        </div>
        <div id="activity-desc" class="desc-item">Activity : 
            <span id="${detailId}-activity" class="desc-element" onclick="editDesc('${detailId}', 'activity')"> ${taskAct}</span>
        </div>
        <div id="detail-desc" class="desc-item">Description : 
            <span id="${detailId}-description" class="desc-element" onclick="editDesc('${detailId}', 'description')">${taskDesc}</span>
        </div>

        <div id="button-div" class="desc-item">
          <button id="save-button" onclick="saveDesc('${detailId}')">Save</button>
          <button id="delete-button" onclick="DeleteTask('${detailId}')">Delete Task</button>
        <div>
      </div>
    `;
    document.getElementById('detail-overlay').appendChild(overlayDesc);
  }
}

// Open entry box for date when + is clicked on
// eslint-disable-next-line no-unused-vars
function addDay(id) {
  const addDayDiv = document.getElementById('add-day');

  addDayDiv.innerHTML = `
    <input id="date-entry" type="date" class="add-day-element">
    <button id="add-day-submit" onclick="addDaySubmit('${id}')" class="add-day-element">Add</button>
    <button id="add-day-cancel" onclick="addDayCancel('${id}')" class="add-day-element">Cancel</button>
    <button id="show-day-dropdrown" onclick="showDayDropDown('${id}')" class="add-day-element">Add day</button>
  `;
}

// Show drop down menu when Add day button is clicked
// eslint-disable-next-line no-unused-vars
function showDayDropDown(id = null) {
  let addDayDiv = null;
  let addButton = false;
  let taskInputDiv = null;
  if (document.getElementById('task-input')) {
    taskInputDiv = document.getElementById('task-input');
    addDayDiv = document.createElement('div');
  } else {
    addDayDiv = document.getElementById('add-day');
    addButton = true;
  }
  const dropDownHTML = `
    <select id="day-dropdown" class="add-day-element">
        <option value="Sunday">Sunday</option>
        <option value="Monday">Monday</option>
        <option value="Tuesday">Tuesday</option>
        <option value="Wednesday">Wednesday</option>
        <option value="Thursday">Thursday</option>
        <option value="Friday">Friday</option>
        <option value="Saturday">Saturday</option>
    </select>
  `;
  if (addButton) {
    addDayDiv.innerHTML = `${dropDownHTML}
      <button id="add-day-submit" onclick="addDaySubmit('${id}')" class="add-day-element">Add</button>
      <button id="add-day-cancel" onclick="addDayCancel('${id}')" class="add-day-element">Cancel</button>
  `;
  } else {
    addDayDiv.innerHTML += dropDownHTML;
    const newAddDayButton = document.querySelector('new-task-submit');
    document.querySelector('.new-task-date').remove();
    document.querySelector('.new-task-day').remove();
    taskInputDiv.appendChild(addDayDiv);
    taskInputDiv.insertBefore(addDayDiv, newAddDayButton);
  }
}

// Remove entry box and add button when cancel is clicked on
// eslint-disable-next-line no-unused-vars
function addDayCancel(id) {
  const addDayDiv = document.getElementById('add-day');
  addDayDiv.innerHTML = `
    <button id="add-day-button" onclick="addDay('${id}')"> + </button>  
  `;
}

// Create widget for newly created date and it's removal button
// eslint-disable-next-line no-unused-vars
function addDaySubmit(id) {
  const addDayDiv = document.getElementById('add-day');

  const inputDateEntry = document.getElementById('date-entry');
  const inputDayEntry = document.getElementById('day-dropdown');

  // const inputDate = inputDateEntry.value;
  // const inputDayEntry inputDayEntry.value;

  let addedDate = null;

  // Date entry box will not exist if day is added and vice versa
  if (inputDateEntry) {
    const inputDate = inputDateEntry.value;
    const dateComp = inputDate.slice(8);
    const monthComp = inputDate.slice(5, 7) - 1;
    const yearComp = inputDate.slice(0, 4);

    const dateObj = new Date(yearComp, monthComp, dateComp);
    addedDate = dateFormat(dateObj);
  } else if (inputDayEntry) {
    const inputDay = inputDayEntry.value;
    addedDate = inputDay;
  } else {
    // Don't accept if field is empty.
    return;
  }

  const deadlineDiv = document.getElementById('task-days');
  const dayDiv = document.createElement('div');
  dayDiv.setAttribute('id', `${id}-deadline-${addedDate}-div`);
  dayDiv.classList.add('day-widget');

  dayDiv.innerHTML = `
    <span id="${id}-deadline-${addedDate}" class="desc-element date-widget">${addedDate}</span>
    <button id="${id}-deadline-${addedDate}-button" onclick="deleteDate('${id}-deadline-${addedDate}-div')">x</button>
  `;

  // Delete entry boxes and refresh + button
  addDayDiv.innerHTML = `
    <button id="add-day-button" onclick="addDay('${id}')"> + </button>  
  `;

  deadlineDiv.appendChild(dayDiv);
}

// Remove date widget when it's removal button (x) is clicked on
// eslint-disable-next-line no-unused-vars
function deleteDate(id) {
  const dateWidget = document.getElementById(id);
  dateWidget.remove();
}

// Click on task description items to edit them using entry boxes and date inputs
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

// Set onclick functions to each task element
function setListen() {
  document.querySelectorAll('.task-element').forEach((element) => {
    let id = element.id.replace('-ele', '');
    id = id.replace('ele-checklist', '');
    element.addEventListener('click', () => openDetail(id));
  });
}

// Delete overlay element when back button is pressed
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

  // jsonString = localStorage.getItem('taskData');
  // jsonObj = JSON.parse(jsonString);

  daysOfWeek.forEach((day) => {
    const dayDiv = document.createElement('div');

    // Division for all components of the day
    dayDiv.classList.add('days');

    const dayHeader = document.createElement('div');
    // Division for day name, date and add task button
    dayHeader.classList.add('day-header');

    const fDate = dateFormat(matDate);
    dayHeader.innerHTML = `
            <div id="add-to-date-${fDate}" class="add-to-date">
              <button type="button" onclick="addToDate('${fDate}')">+</button>
            </div>
            <span class="day-name">${day} (${fDate})</span>
        `;

    dayDiv.appendChild(dayHeader);
    matDate.setDate(matDate.getDate() + 1);

    const taskList = document.createElement('div');

    // Division for task name and checkbox
    taskList.classList.add('task-list');

    /*
      Find each task's day in json and check if it is same as the day of element under construction.
      If it is, add the task name under the constructed header.
    */
    const boxToTick = [];
    if (jsonObj !== null) {
      jsonObj.forEach((category) => {
        category.activityTypes.forEach((activityType) => {
          activityType.Tasks.forEach((task) => {
            task.days.forEach((dayN) => {
              if (dayN === day || dayN === fDate) {
                const id = `${fDate}-${task.taskName}`;
                if (document.getElementById(`${id}-ele`) === null) {
                  taskList.innerHTML += `
                    <div class="name-and-checkbox">
                      <div id="${id}-ele" class="task-element checkbox-label">
                        <p class="checkbox-label"> ${task.taskName} </label>
                      </div>
                      <div class="checkbox">
                        <input type="checkbox" id="${id}-checkbox" name="task-checkbox" value="checked" onchange="checkboxStore('${id}')">
                      </div>
                    <div>
                  `;

                  // Appending now so the division can be checked for existence - prevent duplicates
                  dayDiv.appendChild(taskList);
                  daysContainer.appendChild(dayDiv);
                }

                // Get id of checkboxes to be ticked
                if (task.completion.includes(fDate)) {
                  boxToTick.push(`${id}-checkbox`);
                }
              }
              // Appending now so the division can be checked for existence - prevent duplicates
              dayDiv.appendChild(taskList);
            });
          });
        });
      });
    }
    daysContainer.appendChild(dayDiv);
    // Tick all checkboxes that have a completion date in json.
    boxToTick.forEach((boxId) => {
      document.getElementById(`${boxId}`).checked = true;
    });
  });
  setListen();
}

function addToDate(toDate) {
  if (document.getElementById('stray-task-entry')) {
    return;
  }

  let dayHeader = document.getElementById(`add-to-date-${toDate}-checklist`);
  if (dayHeader === null) {
    dayHeader = document.getElementById(`add-to-date-${toDate}`);
  }
  const strayTaskWin = document.createElement('div');
  strayTaskWin.setAttribute('id', 'stray-task-div');
  strayTaskWin.classList.add('stray-task-overlay');

  strayTaskWin.innerHTML = `
      <input id="stray-task-entry" class="stray-task-entry" type="text" placeholder="Name">
      <input id="stray-desc-entry" class="stray-task-entry" type="text" placeholder="Description">
      <button onclick="strayTaskSubmit('${toDate}')"> Add </button>
      <button onclick="closeStray()"> x </button>
  `;
  dayHeader.appendChild(strayTaskWin);
}

function closeStray() {
  document.getElementById('stray-task-div').remove();
}

function strayToJson() {
  const strayObj = {
    categoryName: 'Stray category',
    activityTypes: [
      {
        activityName: 'Stray activity',
        Tasks: [],
      },
    ],
  };
  if (jsonObj === null) {
    jsonObj = [];
  }
  jsonObj.push(strayObj);
  localStorage.setItem('taskData', JSON.stringify(jsonObj));
}

function isDuplicateTask(checkDate, checkName) {
  let isDuplicate = false;
  jsonObj.forEach((category) => {
    category.activityTypes.forEach((activityType) => {
      activityType.Tasks.forEach((task) => {
        task.days.forEach((dayN) => {
          if (task.taskName === checkName.trim() && dayN === checkDate) {
            isDuplicate = true;
          }
        });
      });
    });
  });
  return isDuplicate;
}

function strayTaskSubmit(toDate) {
  const taskNameEntry = document.getElementById('stray-task-entry');
  const strayDescEntry = document.getElementById('stray-desc-entry');
  const strayName = taskNameEntry.value;
  const strayDesc = strayDescEntry.value;

  if (strayName === '') {
    taskNameEntry.placeholder = 'can\'t be empty';
    return;
  }
  const strayTask = {
    taskName: strayName.trim(),
    taskDescription: strayDesc,
    days: [`${toDate}`],
    completion: [],
  };
  jsonString = localStorage.getItem('taskData');
  jsonObj = JSON.parse(jsonString);
  // If local storage is empty, setup stray category for stray task
  if (jsonString === null) {
    strayToJson();
  }

  if (!isDuplicateTask(toDate, strayName)) {
    // Check if json already has stray category
    let strayIndex = jsonObj.findIndex((category) => category.categoryName.trim() === 'Stray category');

    // If not, add a stray category and get it's index
    if (strayIndex === -1) {
      strayToJson();
      strayIndex = jsonObj.findIndex((category) => category.categoryName.trim() === 'Stray category');
    }

    // Push stray task to stray category
    jsonObj[strayIndex].activityTypes[0].Tasks.push(strayTask);

    jsonString = JSON.stringify(jsonObj);
    localStorage.setItem('taskData', jsonString);

    closeStray();

    // Refresh checklist if task added from checklist
    if (document.getElementById('checklist-title') !== null) {
      openChecklist();
    }
  }

  let newTaskDate = toDate.split('/');
  newTaskDate = new Date(newTaskDate[2], newTaskDate[1] - 1, newTaskDate[0]);

  loadMatrix(newTaskDate);
}
// eslint-disable-next-line no-unused-vars
function DeleteTask(id) {
  const taskName = id.slice(11);

  jsonObj.forEach((category) => {
    category.activityTypes.forEach((activityType) => {
      activityType.Tasks = activityType.Tasks.filter((task) => task.taskName !== taskName);
    });
  });
  jsonString = JSON.stringify(jsonObj);
  localStorage.setItem('taskData', jsonString);
  loadMatrix(date);
  document.getElementById('detailed-desc').remove();
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

  let datesList = [];
  const dateWidgets = Array.from(document.querySelectorAll('.date-widget'));
  dateWidgets.forEach((element) => {
    datesList.push(document.getElementById(element.id).textContent);
  });
  datesList = [...new Set(datesList)];

  jsonObj.forEach((category) => {
    category.activityTypes.forEach((activityType) => {
      activityType.Tasks.forEach((task) => {
        if (task.taskName === taskName) {
          // Prevents same task name mismatch
          if (task.days.includes(taskDate) || task.days.includes(day)) {
            /* eslint-disable no-param-reassign */
            task.taskName = updatedName.trim();
            task.days = datesList;
            task.taskDescription = updateddesc;
            category.categoryName = updatedcategory;
            activityType.activityName = updatedactivity;
            /* eslint-enable no-param-reassign */
          }
        }
      });
    });
  });
  jsonString = JSON.stringify(jsonObj);
  localStorage.setItem('taskData', jsonString);
  // Place matrix on the task that was clicked on
  const dateComponents = taskDate.split('/');

  const formattedDate = `${dateComponents[1]}/${dateComponents[0]}/${dateComponents[2]}`;
  const d = new Date(formattedDate);

  loadMatrix(d);
  document.getElementById('detailed-desc').remove();
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

  /*
    If the checkbox belongs to daily checklist the id will be suffixed with -checklist.
    Split for '-' and get the first element to eliminate the suffix. Works for matrix checkboxes
  */
  const boxName = id.slice(11).split('-')[0];

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
  localStorage.setItem('taskData', JSON.stringify(jsonObj));
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
  date.setDate(1);
  loadMatrix(date);
}

// 1. Adding the category
// let categoryIdCounter = 1;

function addCategory() {
  // Create input for new category name
  const categoryInputHtml = `
        <input type="text" id='new-category-name' placeholder="Category name"> 
        <button onclick="submitCategoryName()">Add</button>
    `;
  document.getElementById('category-entry').innerHTML = categoryInputHtml;
}

function submitCategoryName() {
  let categoryIdCounter = 1;

  if (jsonObj !== null) {
    categoryIdCounter = jsonObj.length + 1;
  }

  const categoryName = document.getElementById('new-category-name').value;
  if (categoryName.trim() === '') {
    alert('Category name cannot be empty');
    return;
  }

  // Push category to json
  categoryToJson(categoryName);

  jsonString = JSON.stringify(jsonObj);
  localStorage.setItem('taskData', jsonString);

  // Create new category div
  const newCategoryDiv = document.createElement('div');
  newCategoryDiv.id = `category-${categoryIdCounter}`; // Assign a unique ID
  newCategoryDiv.classList.add('category');

  // HTML for new category
  newCategoryDiv.innerHTML = `
        <button input="button" onclick="toggleCategory(${categoryIdCounter})">&gt;</button>
        <span id="category-text-${categoryIdCounter}">${categoryName}</span>
        <button input="button" onclick="addActivity(${categoryIdCounter})"> + </button>
        <div id="activities-container-${categoryIdCounter}"></div> 
    `;

  // Add new category to the container
  document.getElementById('categories-container').appendChild(newCategoryDiv);

  document.getElementById('category-entry').innerHTML = '';

  categoryIdCounter += 1;
}

function toggleCategory(categoryId) {
  console.log(`Toggle category ID: ${categoryId}`);
}

// 2. Adding the activity
function addActivity(categoryId) {
  const categoryDiv = document.getElementById(`category-${categoryId}`);
  const existingInput = categoryDiv.querySelector('.activity-input');
  if (existingInput) {
    return;
  }

  // Create input for new activity name
  const activityInputHtml = `
        <div class="activity-input">
            <input type="text" id='new-activity-name-${categoryId}' class="new-activity-name" placeholder="Activity name"> 
            <button onclick="submitActivityName(${categoryId})">Add</button>
        </div>
    `;

  // Insert the input field into the category div
  categoryDiv.insertAdjacentHTML('beforeend', activityInputHtml);
}

function submitActivityName(categoryId) {
  const activityNameInput = document.getElementById(`new-activity-name-${categoryId}`);
  const activityName = activityNameInput.value;
  if (activityName.trim() === '') {
    alert('Activity name cannot be empty');
    return;
  }

  // Push activity name to json
  activityToJson(categoryId, activityName);
  jsonString = JSON.stringify(jsonObj);
  localStorage.setItem('taskData', jsonString);

  const activitiesContainer = document.getElementById(`activities-container-${categoryId}`);
  // Calculate new activity ID based on existing activities
  // const existingActivities = activitiesContainer.getElementsByClassName('activity');
  const activityNumber = jsonObj[categoryId - 1].activityTypes.length;
  const activityId = `${categoryId}-${activityNumber}`;

  // Create new activity div
  const newActivityDiv = document.createElement('div');
  newActivityDiv.id = `activity-${activityId}`;
  newActivityDiv.classList.add('activity');

  // HTML for new activity
  newActivityDiv.innerHTML = `
        <button input="button" onclick="toggleActivity('${activityId}')">&gt;</button>
        <span id="activity-text-${activityId}">${activityName}</span>
        <button input="button" onclick="addTask('${activityId}')"> + </button>
        <div id="tasks-container-${activityId}"></div> <!-- This will hold the tasks for this activity -->
    `;

  // Add new activity to the container
  activitiesContainer.appendChild(newActivityDiv);

  // Remove the input field after adding the activity
  activityNameInput.parentElement.remove();
}

function toggleActivity(activityId) {
  console.log(`Toggle activity ID: ${activityId}`);
}

// 3. Adding the task
function addTask(activityId) {
  const activityDiv = document.getElementById(`activity-${activityId}`);
  const existingInput = activityDiv.querySelector('.task-input');
  if (existingInput) {
    return;
  }

  // Create input fields for new task
  const taskInputHtml = `
        <div id="task-input" class="task-input">
            <input type="text" id='new-task-name-${activityId}' class="new-task-name" placeholder="Task name">
            <input type="text" id='new-task-desc-${activityId}' class="new-task-desc" placeholder="Description">
            <input type="date" id='new-task-date-${activityId}' class="new-task-date" placeholder="Due dates">
            <button id="new-task-day-${activityId}" class="new-task-day" onclick="showDayDropDown()">Add day</button>
            <button id="new-task-submit" onclick="submitTaskName('${activityId}')">Add</button>
        </div>
    `;

  // Insert the input fields into the activity div
  activityDiv.insertAdjacentHTML('beforeend', taskInputHtml);
}

// (dev) need method for adding day
function submitTaskName(activityId) {
  const taskNameInput = document.getElementById(`new-task-name-${activityId}`);
  const taskDescInput = document.getElementById(`new-task-desc-${activityId}`);
  const taskDateInput = document.getElementById(`new-task-date-${activityId}`);
  const taskDayInput = document.getElementById('day-dropdown');
  const taskName = taskNameInput.value;
  const taskDesc = taskDescInput.value;
  let taskDate = null;

  if (taskDayInput) {
    taskDate = taskDayInput.value;
  } else {
    taskDate = taskDateInput.value;
  }

  if (taskName.trim() === '' || taskDesc.trim() === '' || taskDate.trim() === '') {
    alert('Task name, description, and due date cannot be empty');
    return;
  }

  // Convert date from yyyy-mm-dd to dd/mm/yyyy format
  if (!taskDayInput) {
    const dateParts = taskDate.split('-');
    taskDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
  }

  // Push task details to json
  taskToJson(activityId, taskName, taskDate, taskDesc);
  jsonString = JSON.stringify(jsonObj);
  localStorage.setItem('taskData', jsonString);

  const catCount = activityId.slice(0, 1) - 1;
  const actCount = activityId.slice(2, 3) - 1;
  const tasksContainer = document.getElementById(`tasks-container-${activityId}`);
  // Calculate new task ID based on existing tasks
  // const existingTasks = tasksContainer.getElementsByClassName('task');
  const taskNumber = jsonObj[catCount].activityTypes[actCount].Tasks.length;
  const categoryId = activityId.split('-')[0];
  const taskId = `${activityId}-${taskNumber}`;

  // Create new task div
  const newTaskDiv = document.createElement('div');
  newTaskDiv.id = `task-${taskId}`;
  newTaskDiv.classList.add('task');

  // HTML for new task
  newTaskDiv.innerHTML = `
        <span id="task-name-${taskId}">${taskName}</span>
        <span id="task-desc-${taskId}">${taskDesc}</span>
        <span id="task-date-${taskId}">${taskDate}</span>
    `;

  // Add new task to the container
  tasksContainer.appendChild(newTaskDiv);

  // Get the tasks added to the category page to the local storage
  //   getTasksToChecklist(taskName, taskDate, taskId);

  // Remove the input fields after adding the task
  taskNameInput.parentElement.remove();
}

function JsonToCategory() {
  let catCounter = 0;
  let actCounter = 0;
  let taskCounter = 0;

  const catContainer = document.getElementById('categories-container');
  catContainer.innerHTML = '';
  jsonObj.forEach((category) => {
    actCounter = 0;
    catCounter += 1;

    const catDiv = document.createElement('div');
    catDiv.classList.add('category');
    catDiv.setAttribute('id', `category-${catCounter}`);

    catDiv.innerHTML = `
      <button input="button" onclick="toggleCategory(${catCounter})"> &gt </button>
      <span id="category-text-${catCounter}">${category.categoryName}</span>
      <button input="button" onclick="addActivity(${catCounter})"> + </button>
    `;

    const actContainer = document.createElement('div');
    actContainer.setAttribute('id', `activities-container-${catCounter}`);

    catContainer.appendChild(catDiv);

    category.activityTypes.forEach((activityType) => {
      taskCounter = 0;
      actCounter += 1;

      const actDiv = document.createElement('div');
      actDiv.setAttribute('id', `activity-${catCounter}-${actCounter}`);
      actDiv.classList.add('activity');

      actDiv.innerHTML = `
      <button input="button" onclick="toggleActivity('${catCounter}-${actCounter}')"> &gt </button>
      <span id="activity-text-${catCounter}-${actCounter}">${activityType.activityName}</span>
      <button input="button" onclick="addTask('${catCounter}-${actCounter}')"> + </button>
      `;

      const taskContainer = document.createElement('div');
      taskContainer.setAttribute('id', `tasks-container-${catCounter}-${actCounter}`);

      actContainer.appendChild(actDiv);
      catDiv.appendChild(actContainer);

      activityType.Tasks.forEach((task) => {
        taskCounter += 1;
        const taskDiv = document.createElement('div');
        taskDiv.setAttribute('id', `task-${catCounter}-${actCounter}-${taskCounter}`);
        taskDiv.classList.add('task');

        taskDiv.innerHTML = `
          <span id="task-name-${catCounter}-${actCounter}-${taskCounter}">${task.taskName}</span>
          <span id="task-desc-${catCounter}-${actCounter}-${taskCounter}">${task.taskDescription}</span>
          <span id="task-date-${catCounter}-${actCounter}-${taskCounter}">${task.days}</span>
        `;

        taskContainer.appendChild(taskDiv);
        actDiv.appendChild(taskContainer);
      });
    });
  });
}

// eslint-disable-next-line no-unused-vars
function openCategoryPage() {
  checklistPage.style.display = 'none';
  matrix.style.display = 'none';
  categoryPage.style.display = 'block';
  if (jsonObj !== null) {
    JsonToCategory();
  }
  header.style.display = 'none';
}

function giveToday() {
  const today = new Date();
  return today;
}
// eslint-disable-next-line no-unused-vars
function backFromCategory() {
  document.getElementById('categories-container').innerHTML = '';
  categoryPage.style.display = 'none';
  header.style.display = 'block';
  loadMatrix(giveToday());
  matrix.style.display = 'block';
}

function categoryToJson(category) {
  const index = jsonObj.findIndex((cat) => cat.categoryName === category);

  // Disallow duplicate entries
  if (index === -1) {
    const categoryJSON = { categoryName: category, activityTypes: [] };
    if (jsonObj === null) {
      jsonObj = [];
    }
    jsonObj.push(categoryJSON);

    jsonString = JSON.stringify(jsonObj);
    localStorage.setItem('taskData', jsonString);
  }
}

function activityToJson(categoryId, activity) {
  const catText = document.getElementById(`category-text-${categoryId}`).textContent;

  const index = jsonObj.findIndex((cat) => cat.categoryName === catText);

  const activityjson = {
    activityName: activity,
    Tasks: [],
  };

  jsonObj[index].activityTypes.push(activityjson);

  localStorage.setItem('taskData', JSON.stringify(jsonObj));
}

function taskToJson(activityId, taskName, taskDate, taskDesc) {
  const actText = document.getElementById(`activity-text-${activityId}`).textContent;
  const taskDateList = [taskDate];

  if (!isDuplicateTask(taskDate, taskName)) {
    // Push task details to json
    const tasksJson = {
      taskName: taskName.trim(),
      taskDescription: taskDesc,
      days: [],
      completion: [],
    };

    tasksJson.days = tasksJson.days.concat(taskDateList);

    jsonObj.forEach((cat) => {
      cat.activityTypes.forEach((activity) => {
        if (activity.activityName === actText) {
          activity.Tasks.push(tasksJson);
        }
      });
    });
    localStorage.setItem('taskData', JSON.stringify(jsonObj));
  }
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
  const id = `${todayDate}-${taskName}`;
  const taskElementHtml = `
    <div class="task-list">
      <div class="name-and-checkbox">
        <div id="${id}-ele-checklist" class="task-element checkbox-label">
            <p class="checkbox-label">${taskName}</p>
        </div>   
        <div class="checkbox">
          <input type="checkbox" id="${id}-checkbox-checklist" name="task-checkbox" value="checked" onchange="checkboxStore('${id}-checkbox')">
        </div>
      </div> 
    </div>
  `;

  checklistPage.innerHTML += taskElementHtml;

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
            if (document.getElementById(`${todayDate}-${task.taskName}-ele-checklist`) === null) {
              renderTaskToChecklist(todayDate, task.taskName, boxToTick);
            }
          }
        });
      });
    });
  });
}

function setDayHeader(todayDay, todayDate) {
  const dayHeader = document.getElementById('day-header');
  dayHeader.innerHTML = `
    <div id="add-to-date-${todayDate}-checklist" class="add-to-date">
      <button type="button" onclick="addToDate('${todayDate}')">+</button>
    </div>
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
  loadMatrix(giveToday());
  header.style.display = 'block';
  matrix.style.display = 'block';
}

function openChecklist() {
  categoryPage.style.display = 'none';
  matrix.style.display = 'none';
  header.style.display = 'none';
  checklistPage.style.display = 'block';
  checklistPage.innerHTML = `
    <img src="images/back.png" id="back-img-checklist" onclick="backFromChecklist()">
    <h1 id="checklist-title" class="checklist-title">Today's Tasks</h1>
    <div class="day-header" id="day-header">
    </div>  
  `;
  getDayDate();
  setListen();
}

/* activate toggle menu */
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  /* search functionality */
  const performSearch = (query) => {
    console.log('Searching for:', query);
  };

  const searchInputs = [document.getElementById('searchInputDesktop'), document.getElementById('searchInputMobile')];

  searchInputs.forEach((input) => {
    input.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        performSearch(input.value);
      }
    });
  });
});

// Intro page file upload - Template feature
function handleFile(file) {
  // Create a FileReader instance
  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      // Parse the JSON data from the file
      const jsonData = JSON.parse(e.target.result);

      // Set the json object as global variable
      jsonObj = jsonData;

      // Convert the JSON object to a string
      jsonString = JSON.stringify(jsonData);

      // Save the JSON string to local storage
      localStorage.setItem('taskData', jsonString);

      // Log a success message
      console.log('JSON data saved to local storage.');
    } catch (error) {
      // Handle errors during JSON parsing
      console.error('Error parsing JSON file:', error);
    }
  };

  // Read the file as text
  reader.readAsText(file);
}

function prepareFileForConfirmation() {
  // Get the file input element
  const fileInput = document.getElementById('fileInput');

  // Check if a file is selected and update the label with the file name
  if (fileInput.files.length > 0) {
    const fileName = fileInput.files[0].name;
    document.querySelector('label[for="fileInput"]').innerText = fileName;

    // Dynamically create and insert the "Confirm" button if it doesn't already exist
    const confirmBtnExists = document.getElementById('confirmBtn');
    if (!confirmBtnExists) {
      const confirmBtn = document.createElement('button');
      confirmBtn.innerText = 'Confirm';
      confirmBtn.id = 'confirmBtn';
      confirmBtn.className = 'choice-btn';
      document.getElementById('file-input-container').appendChild(confirmBtn);

      // Add event listener to the "Confirm" button
      confirmBtn.addEventListener('click', () => {
        handleFile(fileInput.files[0]);
        loadMatrix(date);
      });
    }
  } else {
    // Log a message if no file is selected
    console.log('No file selected.');
  }
}

// Add event listener to the file input
document.getElementById('fileInput').addEventListener('change', prepareFileForConfirmation);

function openSettings() {
  settingsPage.style.display = 'block';
}

function backFromSettings() {
  settingsPage.style.display = 'none';
}

// eslint-disable-next-line no-unused-vars
function exportJSON() {
  const jsonString = JSON.stringify(jsonObj);

  const blob = new Blob([jsonString], { type: 'application/json' });

  const downloadLink = document.createElement('a');
  downloadLink.href = window.URL.createObjectURL(blob);
  downloadLink.download = 'data.json';

  document.body.appendChild(downloadLink);

  downloadLink.click();

  document.body.removeChild(downloadLink);
}
