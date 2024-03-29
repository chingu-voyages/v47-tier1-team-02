// Follows Airbnb JavaScript style guide
if ('serviceWorker' in navigator) {
  // Wait for the 'load' event to not block other work
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('/service-worker.js');
    } catch (err) {
      return null;
    }
    return null;
  });
}

// Date object with today's date.
const date = new Date();

// Object that stores details of the tasks
let jsonObj = [];

// Used for parsing to string and storing to local storage
let jsonString = null;

// Get all pages and page components
const intro = document.getElementById('intro');
const introForm = document.getElementById('intro-form');
const welcomePage = document.getElementById('welcome-page');
const introFormInput = document.getElementById('introForm-input');
const matrix = document.getElementById('matrix');
const checklistPage = document.getElementById('checklist-page');
const categoryPage = document.getElementById('category-page');
const settingsPage = document.getElementById('settings-page');
const header = document.querySelector('header');
const navMenu = document.getElementById('nav-menu');
const dropdown = document.getElementById('months-dropdown');
const footer = document.getElementById('footer');
const body = document.querySelector('body');

// Handle local storage empty and not empty cases
if (localStorage.getItem('taskData') === null) {
  header.style.display = 'none';
  checklistPage.style.display = 'none';
  categoryPage.style.display = 'none';
  matrix.style.display = 'none';
} else {
  footer.style.display = 'none';
  intro.style.display = 'none';
  introForm.style.display = 'none';
  categoryPage.style.display = 'none';
  matrix.style.display = 'block';
  jsonString = localStorage.getItem('taskData');
  jsonObj = JSON.parse(jsonString);
}
settingsPage.style.display = 'none';

document.addEventListener('click', (e) => {
  if (e.target.id === 'start-btn') {
    welcomePage.style.display = 'none';
    introForm.style.display = 'block';
  } else if (e.target.id === 'decline-btn') {
    introForm.style.display = 'none';
    welcomePage.style.display = 'none';
    introFormInput.value = '';
    footer.style.display = 'none';
    matrix.style.display = 'block';
    header.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (e.target.id === 'month-name') {
    navMenu.classList.remove('active');
  }
});

// Return date object with today's date
function giveToday() {
  const today = new Date();
  return today;
}

// Function to display greeting with provided username
function displayGreeting() {
  const userName = localStorage.getItem('name');
  if (userName) {
    const greetingElement = document.getElementById('greeting');
    greetingElement.innerHTML = `Hello, <span class="user-underline">${userName}<span>!`;
    greetingElement.style.display = 'block';
  }
}

// Display username on top of page when intro form is submitted
introForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const introFormData = new FormData(introForm);
  const inputValue = introFormData.get('user');

  localStorage.setItem('name', inputValue);
  displayGreeting();

  introFormInput.value = '';
  intro.style.display = 'none';
  matrix.style.display = 'block';
  header.style.display = 'block';
});

// Convert date object to DD/MM/YYYY string format
function dateFormat(fDate) {
  const dd = String(fDate.getDate()).padStart(2, '0');
  const mm = String(fDate.getMonth() + 1).padStart(2, '0');
  const yyyy = fDate.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// Update the name of month in dropdown box whenever week change implies change in month
function setMonthName(mDate) {
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December',
  ];

  // Get current month of the provided parameter date
  const monthIndex = mDate.getMonth();
  // Drop down box
  document.getElementById('month-name').innerHTML = `${months[monthIndex]}`;
}

// Return day of DD/MM/YYYY format string
function giveDay(iDate) {
  const dateComponents = iDate.split('/');

  const formattedDate = `${dateComponents[1]}/${dateComponents[0]}/${dateComponents[2]}`;

  const d = new Date(formattedDate);
  const dayIndex = d.getDay();

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return daysOfWeek[dayIndex];
}

// To open task description page when task element is clicked on
function openDetail(id) {
  // Prevent stacking of task description pages
  if (document.getElementById('detailed-desc') == null) {
    let taskCat; let taskAct; let taskDesc = ''; let taskDays; let detailId; let day; let taskDate; let taskName;

    // If function invoked from category page
    if (categoryPage.style.display === 'block') {
      // id format: <CategoryName, ActivityName, TaskName> (from category page)
      const catActTask = id.split(', ');
      const catCat = catActTask[0];
      const catAct = catActTask[1];
      const catTask = catActTask[2];
      taskName = catTask;
      detailId = id;

      // Match order : category -> Activity -> Task => Get task details
      jsonObj.forEach((category) => {
        if (category.categoryName.trim() === catCat) {
          category.activityTypes.forEach((activityType) => {
            if (activityType.activityName.trim() === catAct) {
              activityType.Tasks.forEach((task) => {
                if (task.taskName.trim() === catTask) {
                  taskDesc = task.taskDescription;
                  taskCat = category.categoryName;
                  taskAct = activityType.activityName;
                  taskDays = task.days;
                }
              });
            }
          });
        }
      });
    } else { // If function invoked from matrix/checklist page: id format = <taskDate-taskName>
      taskDate = id.slice(0, 10);

      taskName = id.slice(11);

      detailId = `${taskDate}-${taskName}`;

      // To check for due date with day as well, get day of date
      day = giveDay(taskDate);

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
    }

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
            <button id="${detailId}-deadline-${taskDay}-button" onclick="deleteDate('${detailId}-deadline-${taskDay}-div')"><img src = "images/circle-xmark-regular.svg" alt="xmark icon" width="20"/></button>
          </div>
      `;
    });

    // Title that appears in the top of the task description page
    let headerText;

    // If function invoked from category page, it won't have a specific date and day
    if (categoryPage.style.display === 'block') {
      headerText = 'Edit Task';
    } else {
      headerText = `${day} (${taskDate})`;
    }

    if (taskDesc === '') {
      taskDesc = 'No Description';
    }
    // On clicking any of the attributes in the description, give id (name and date) to editDesc
    overlayDesc.innerHTML = `
      <div id="back-n-day">
      <img src="images/circle-xmark-regular.svg" class="icons" onclick="backFromDesc()" rel="Go back">

        <span id="desc-day">${headerText}</span>
      </div>

      <div id="task-desc">
        <div id="name-desc" class="desc-item">
          <img src = "images/task-icon.svg" width="15" alt="task icon"/>
          <p class="task-desc-text">Task name:
            <span id="${detailId}-name" class="desc-element" onclick="editDesc('${detailId}', 'name')"> ${taskName}</span>
          </p>
        </div>
        <div id="deadline-desc" class="desc-item">
          <div class="deadline-desc-div">
            <img src = "images/deadline.svg" width="15" alt="deadline icon"/>
            <p class="task-desc-text">Deadline: </p>
          </div>
          <div id="task-days" class="task-days">
              ${htmlAdd}
            </div>
            <div id="add-day">
              <button id="add-day-button" onclick="addDay('${detailId}')"><img src = "images/add-icon.svg"  class="icons" alt="plus icon"/></button>
            </div>
         </div>
        <div id="category-desc" class="desc-item">
          <img src = "images/category-icon.svg" width="20" alt="category icon"/>
          <p class="task-desc-text">Category:
              <span id="${detailId}-category" class="desc-element" onclick="editDesc('${detailId}', 'category')">${taskCat}</span>
          </p>
        </div>
        <div id="activity-desc" class="desc-item">
          <img src = "images/list-solid.svg" width="15" alt="activity icon"/>
          <p class="task-desc-text">Activity:
              <span id="${detailId}-activity" class="desc-element" onclick="editDesc('${detailId}', 'activity')">${taskAct}</span>
          </p>
        </div>
        <div id="detail-desc" class="desc-item">
          <img src = "images/description.svg" width="15" alt="description icon"/>
          <p class="task-desc-text">Description:
              <span id="${detailId}-description" class="desc-element" onclick="editDesc('${detailId}', 'description')">${taskDesc}</span>
          </p>
        </div>

        <div id="button-div" class="desc-item">
          <button id="save-button" onclick="saveDesc('${detailId}')">Save</button>
          <button id="delete-button" onclick="deleteTask('${detailId}')">Delete</button>
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
    <button id="show-day-dropdrown" onclick="showDayDropDown('${id}')" class="add-day-element">Repeat Weekly</button>
    <button id="add-day-submit" onclick="addDaySubmit('${id}')" class="add-day-element">Add</button>
    <button id="add-day-cancel" onclick="addDayCancel('${id}')" class="add-day-element">Cancel</button>
  `;
}

// Show drop down menu when Add day button is clicked
// eslint-disable-next-line no-unused-vars
function showDayDropDown(id = null) {
  let addDayDiv = null;

  let addButton = false;

  let taskInputDiv = null;

  // If function invoked from category page, 'task-input' will exist
  if (document.getElementById('task-input')) {
    taskInputDiv = document.getElementById('task-input');
    addDayDiv = document.createElement('div');
  } else {
    addDayDiv = document.getElementById('add-day');
    addButton = true;
  }
  const dropDownHTML = `
    <select id="day-dropdown" class="add-day-element">
        <option value="Sunday">every Sunday</option>
        <option value="Monday">every Monday</option>
        <option value="Tuesday">every Tuesday</option>
        <option value="Wednesday">every Wednesday</option>
        <option value="Thursday">every Thursday</option>
        <option value="Friday">every Friday</option>
        <option value="Saturday">every Saturday</option>
    </select>
  `;

  // Append add and cancel buttons if function invoked from matrix.
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
    <button id="add-day-button" onclick="addDay('${id}')"><img src = "images/add-icon.svg" class="icons" alt="plus icon"/></button>  
  `;
}

// Create widget for newly created date and it's removal button
// eslint-disable-next-line no-unused-vars
function addDaySubmit(id) {
  const addDayDiv = document.getElementById('add-day');

  const inputDateEntry = document.getElementById('date-entry');
  const inputDayEntry = document.getElementById('day-dropdown');

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
    <button id="${id}-deadline-${addedDate}-button" onclick="deleteDate('${id}-deadline-${addedDate}-div')"><img src = "images/circle-xmark-regular.svg" alt="xmark icon" width="20"/></button>
  `;

  // Delete entry boxes and refresh + button
  addDayDiv.innerHTML = `
    <button id="add-day-button" onclick="addDay('${id}')"> <img src = "images/add-icon.svg" class="icons" alt="plus icon"/></button>  
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

// Set onclick functions to each task element - to open task description page
function setListen() {
  document.querySelectorAll('.task-element').forEach((element) => {
    let id = element.id.replace('-ele', '');
    id = id.replace('-checklist', '');

    element.addEventListener('click', () => openDetail(id));
  });
}

// Delete overlay element when back button is pressed
// eslint-disable-next-line no-unused-vars
function backFromDesc() {
  const descWin = document.getElementById('detailed-desc');
  navMenu.classList.remove('active');
  dropdown.style.display = 'none';
  body.classList.remove('blur');
  descWin.remove();
}

let bigScreen = false;

// Keep track of the week that is being built by loadMatrix()
let renderWeek = 1;

if (window.screen.width > 1300) {
  bigScreen = true;
}

// Display the calendar
function loadMatrix(matDate) {
  const matrixContainer = document.getElementById('desktop-table');
  let daysContainer = document.getElementById('mobile-table');

  if (bigScreen) {
    // Contains elements of a single week
    daysContainer = document.createElement('div');
    daysContainer.setAttribute('id', `week-${renderWeek}`);
    daysContainer.classList.add('desktop-days');

    // // Display week number on top of week container
    // const weekLabel = document.createElement('div');
    // weekLabel.classList.add('week-label');
    // weekLabel.textContent = `week ${renderWeek}`;

    // daysContainer.appendChild(weekLabel);

    if (renderWeek === 1) {
      // If the week is not already displayed
      if (document.getElementById(`week-${renderWeek}`) === null) {
        matDate.setDate(1);
      }
      // clear the matrix each time the first week is being displayed
      matrixContainer.innerHTML = '';
    }
  } else {
    // If the screen is small, clear the single week that could already be on screen
    daysContainer.innerHTML = '';
  }
  // Display the current month name in the dropdown button
  setMonthName(matDate);
  const dayNum = matDate.getDay();

  // Set date to the last Sunday to build day elements from the top
  matDate.setDate(matDate.getDate() - dayNum);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
              <button type="button" onclick="addToDate('${fDate}')" title="Add new task"><img src = "images/add-icon.svg" width="20" alt="plus icon"/></button>
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
                        <p class="checkbox-label" title="Show details"> ${task.taskName} </label>
                      </div>
                      <div class="checkbox">
                        <input type="checkbox" id="${id}-checkbox" class="checkbox-box" name="task-checkbox" value="checked" onchange="checkboxStore('${id}')" title="Mark as done">
                      </div>
                    <div>
                  `;

                  // Appending now so the division can be selected on next iteration
                  dayDiv.appendChild(taskList);
                  daysContainer.appendChild(dayDiv);

                  matrixContainer.appendChild(daysContainer);
                  matrix.appendChild(matrixContainer);
                }

                // Get id of checkboxes to be ticked
                if (task.completion.includes(fDate)) {
                  boxToTick.push(`${id}-checkbox`);
                }
              }
              dayDiv.appendChild(taskList);
            });
          });
        });
      });
    }
    daysContainer.appendChild(dayDiv);

    matrixContainer.appendChild(daysContainer);
    matrix.appendChild(matrixContainer);

    // Tick all checkboxes that have a completion date in json.
    boxToTick.forEach((boxId) => {
      document.getElementById(`${boxId}`).checked = true;
    });
  });

  if (bigScreen && renderWeek < 4) {
    // Prepare the next week for load
    renderWeek += 1;
    loadMatrix(matDate);
  } else {
    // Reset to display the first week next if 4 weeks are already displayed
    renderWeek = 1;
  }

  // Set onclick functions to all task elements -> click to open task description page
  setListen();
}

document.addEventListener('DOMContentLoaded', () => {
  loadMatrix(date);
});

function deviceLoad(newDate) {
  if (bigScreen) {
    // Reset date to first week of current display so dates don't change
    date.setDate(date.getDate() - 28);
    loadMatrix(date);
  } else {
    loadMatrix(newDate);
  }
}

// eslint-disable-next-line no-unused-vars
function addToDate(toDate) {
  if (document.getElementById('stray-task-entry')) {
    return;
  }

  // Check if the click was from checklist or matrix page
  let dayHeader = document.getElementById(`add-to-date-${toDate}-checklist`);
  if (dayHeader === null) {
    dayHeader = document.getElementById(`add-to-date-${toDate}`);
  }

  const strayTaskWin = document.createElement('div');
  strayTaskWin.setAttribute('id', 'stray-task-div');
  strayTaskWin.classList.add('stray-task-overlay');

  strayTaskWin.innerHTML = `
      <div class="stray-task-entry">
      <input id="stray-task-entry" class="stray-task-entry" type="text" placeholder="Name">
      <input id="stray-desc-entry" class="stray-task-entry" type="text" placeholder="Description">
      </div>
      <div>
      <button onclick="strayTaskSubmit('${toDate}')"><img src = "images/square-plus-solid.svg" width="20" alt="plus icon"/></button>
      <button onclick="closeStray()"><img src = "images/square-minus-regular.svg" width="20" alt="xmark icon"/></button>
      </div>
      `;
  dayHeader.appendChild(strayTaskWin);
}

// Get the current date and day to be displayed the Today's Checklist page
function getChecklistDay() {
  const todayDate = new Date();
  const dayIndex = String(todayDate.getDay());
  const checklistDate = dateFormat(todayDate);
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return [daysOfWeek[dayIndex], checklistDate];
}

// Put matched task elements in checklist page
function renderTaskToChecklist(todayDate, taskName, boxToTick) {
  const id = `${todayDate}-${taskName}`;
  const taskElementHtml = `
    <div class="task-list">
      <div class="name-and-checkbox">
        <div id="${id}-ele-checklist" class="task-element checkbox-label">
            <p class="checkbox-label">${taskName}</p>
        </div>   
        <div class="checkbox">
          <input type="checkbox" id="${id}-checkbox-checklist" class="checkbox-box" name="task-checkbox" value="checked" onchange="checkboxStore('${id}-checkbox')" title="Mark as done">
        </div>
      </div> 
    </div>
  `;

  checklistPage.innerHTML += taskElementHtml;

  boxToTick.forEach((boxId) => {
    document.getElementById(`${boxId}-checkbox-checklist`).checked = true;
  });
}

// Find tasks with today's date
function findTasks() {
  const dayDate = getChecklistDay(); // Returns date and day in an array
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

// Set today's day name and date for checklist page
function setDayHeader(todayDay, todayDate) {
  const dayHeader = document.getElementById('day-header');
  dayHeader.innerHTML = `
    <div id="add-to-date-${todayDate}-checklist" class="add-to-date">
      <button type="button" onclick="addToDate('${todayDate}')" title="Add new task"><img src = "images/add-icon.svg" width="20" alt="plus icon"/></button>
    </div>
    <span class="day-name">${todayDay} (${todayDate})</span>
  `;
  findTasks();
}

// Close checklist and return to matrix
// eslint-disable-next-line no-unused-vars
function backFromChecklist() {
  navMenu.classList.remove('active');
  checklistPage.innerHTML = '';
  checklistPage.style.display = 'none';
  deviceLoad(giveToday());
  header.style.display = 'block';
  matrix.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Get today's day and date as an array and update checklist with it
function getDayDate() {
  const dayDate = getChecklistDay();
  const todayDay = dayDate[0];
  const todayDate = dayDate[1];

  setDayHeader(todayDay, todayDate);
}

// Open the checklist (today's tasks) page
function openChecklist() {
  categoryPage.style.display = 'none';
  matrix.style.display = 'none';
  header.style.display = 'none';
  checklistPage.style.display = 'block';
  checklistPage.innerHTML = `
    <img src="images/circle-xmark-regular.svg" class="icons" onclick="backFromChecklist()" rel="Go back">
    <h1 id="checklist-title" class="checklist-title">Today's Tasks</h1>
    <div class="day-header" id="day-header">
    </div>  
  `;
  getDayDate();
  setListen();
}

// Create a new stray category array if it doesn't exist.
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

// Disallow tasks with same name on the same date
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

function closeStray() {
  document.getElementById('stray-task-div').remove();
}

// Submit tasks created from matrix using + button
// eslint-disable-next-line no-unused-vars
function strayTaskSubmit(toDate) {
  const taskNameEntry = document.getElementById('stray-task-entry');
  const strayDescEntry = document.getElementById('stray-desc-entry');
  const strayName = taskNameEntry.value;
  const strayDesc = strayDescEntry.value;

  const modifiedStrayName = strayName.replace(/[^a-zA-Z0-9\s]/g, '').trim();

  if (strayName === '') {
    taskNameEntry.placeholder = 'can\'t be empty';
    return;
  }

  const strayTask = {
    taskName: modifiedStrayName,
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

  // Check if a task exists with same name and date
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
  deviceLoad(newTaskDate);
}

// Add tasks from json to Category page
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
      <button input="button" class="cat-page-toggle-btn" onclick="toggleCategory(${catCounter})" title="Collapse/Expand activitiies"><img src="images/chevron-right-icon.svg" alt="arrow left icon" width="10"/></button>
      <span id="category-text-${catCounter}" class="category-text">${category.categoryName}</span>
      <div class="add-activity-container">
        <button input="button" onclick="addActivity(${catCounter})" class="add-activity-btn cat-page-plus-btn">+</button>
        <span class="hover-text">Add activity</span>
      </div>
      <div id="activities-container-${catCounter}"></div> 
    `;

    const actContainer = document.createElement('div');
    actContainer.setAttribute('id', `activities-container-${catCounter}`);
    actContainer.classList.add('activities-container');

    catContainer.appendChild(catDiv);

    category.activityTypes.forEach((activityType) => {
      taskCounter = 0;
      actCounter += 1;

      const actDiv = document.createElement('div');
      actDiv.setAttribute('id', `activity-${catCounter}-${actCounter}`);
      actDiv.classList.add('activity');

      actDiv.innerHTML = `
      <button input="button" class="cat-page-toggle-btn" onclick="toggleActivity('${catCounter}-${actCounter}')" title="Collapse/Expand tasks"><img src="images/chevron-right-icon.svg" alt="chevron right icon" width="10"/></button>
      <span id="activity-text-${catCounter}-${actCounter}" class="activity-text">${activityType.activityName}</span>
      <div class="add-task-container">
        <button input="button" onclick="addTask('${catCounter}-${actCounter}')" class="add-task-btn cat-page-plus-btn">+</button>
        <span class="hover-text">Add task</span>
      </div>
      `;

      const taskContainer = document.createElement('div');
      taskContainer.setAttribute('id', `tasks-container-${catCounter}-${actCounter}`);
      taskContainer.classList.add('task-container');

      actDiv.appendChild(taskContainer);
      actContainer.appendChild(actDiv);
      catDiv.appendChild(actContainer);

      activityType.Tasks.forEach((task) => {
        taskCounter += 1;
        const id = `${catCounter}-${actCounter}-${taskCounter}`;
        const taskDiv = document.createElement('div');
        taskDiv.setAttribute('id', `task-${id}`);
        taskDiv.classList.add('task');

        let taskDayGroup = '';
        if (task.days !== null) {
          task.days.forEach((taskDay) => {
            taskDayGroup += `
              <span class="task-day-element">${taskDay}</span>
            `;
          });
        }
        const catActTask = `${category.categoryName.trim()}, ${activityType.activityName.trim()}, ${task.taskName.trim()}`;
        taskDiv.innerHTML = `
          <div class="taskDiv-div">
            <div onclick="openDetail('${catActTask}')"><img src = "images/edit.svg" width="20" alt="edit icon"/ title="Click to edit task">
            </div>

            <div>
              <div class="tasks-div">
                <div class="element-main">
                  <p>Task:</p>
                </div>
                <span id="name-${catActTask}" class="element-span">${task.taskName}</span>
              </div>

              <div class="tasks-div">
                <div class="element-main">
                  <p>description:</p>
                </div>
              <span id="desc-${catActTask}" class="element-span">${task.taskDescription}</span>
              </div>
              
              <div class="deadline-div">
                <div class="deadline-main">
                  <p>Deadline:</p>
                </div>
                <span class="deadline-span element-span" id="date-${catActTask}"></span>
              </div>
          </div>
          </div>
          `;

        taskContainer.appendChild(taskDiv);
        actDiv.appendChild(taskContainer);

        const deadlineSpan = document.getElementById(`date-${catActTask}`);
        deadlineSpan.innerHTML = taskDayGroup;
      });
    });
  });
}

// Display the category page and fetch data into it
function openCategoryPage() {
  checklistPage.style.display = 'none';
  matrix.style.display = 'none';
  categoryPage.style.display = 'block';
  if (jsonObj !== null) {
    JsonToCategory();
  }
  header.style.display = 'none';
}

// eslint-disable-next-line no-unused-vars
function deleteTask(id) {
  if (categoryPage.style.display === 'block') {
    // id format : <categoryName, activityName, taskName>
    const catActTask = id.split(', ');
    const catName = catActTask[0];
    const actName = catActTask[1];
    const taskName = catActTask[2];

    // Match order: category -> activity -> task and delete the task from json
    jsonObj.forEach((category) => {
      if (category.categoryName === catName) {
        category.activityTypes.forEach((activityType) => {
          if (activityType.activityName === actName) {
            activityType.Tasks.forEach((task) => {
              if (task.taskName === taskName) {
                // eslint-disable-next-line no-param-reassign
                activityType.Tasks = activityType.Tasks.filter(
                  // eslint-disable-next-line no-shadow
                  (task) => task.taskName !== taskName,
                );
              }
            });
          }
        });
      }
    });
    openCategoryPage();
  } else {
    const taskName = id.slice(11);

    jsonObj.forEach((category) => {
      category.activityTypes.forEach((activityType) => {
        // eslint-disable-next-line no-param-reassign
        activityType.Tasks = activityType.Tasks.filter((task) => task.taskName !== taskName);
      });
    });
    jsonString = JSON.stringify(jsonObj);
    localStorage.setItem('taskData', jsonString);
    if (matrix.style.display === 'block') {
      deviceLoad(date);
    } else if (checklistPage.style.display === 'block') {
      openChecklist();
    }
  }
  jsonString = JSON.stringify(jsonObj);
  localStorage.setItem('taskData', jsonString);
  document.getElementById('detailed-desc').remove();
}

// Add data from task description to json when save button is clicked from category page.
function saveDescCatPage(id) {
  const catActTask = id.split(', ');
  const catName = catActTask[0];
  const actName = catActTask[1];
  const taskName = catActTask[2];

  // Get IDs of all elements in task description page
  const nameId = `${id}-name`;
  const categoryId = `${id}-category`;
  const activityId = `${id}-activity`;
  const descId = `${id}-description`;

  let updatedName = document.getElementById(nameId).textContent;
  updatedName = updatedName.replace(/[^a-zA-Z0-9\s]/g, '').trim();

  let updatedCategory = document.getElementById(categoryId).textContent;
  updatedCategory = updatedCategory.replace(/[^a-zA-Z0-9\s]/g, '').trim();

  let updatedActivity = document.getElementById(activityId).textContent;
  updatedActivity = updatedActivity.replace(/[^a-zA-Z0-9\s]/g, '').trim();

  let updatedDesc = document.getElementById(descId).textContent;
  updatedDesc = updatedDesc.replace(/[^a-zA-Z0-9\s]/g, '').trim();

  let datesList = [];
  const dateWidgets = Array.from(document.querySelectorAll('.date-widget'));
  dateWidgets.forEach((element) => {
    datesList.push(document.getElementById(element.id).textContent);
  });
  datesList = [...new Set(datesList)];

  jsonObj.forEach((category) => {
    if (category.categoryName === catName) {
      category.activityTypes.forEach((activityType) => {
        if (activityType.activityName === actName) {
          activityType.Tasks.forEach((task) => {
            if (task.taskName === taskName) {
              /* eslint-disable no-param-reassign */
              task.taskName = updatedName;
              task.days = datesList;
              task.taskDescription = updatedDesc;
              category.categoryName = updatedCategory;
              activityType.activityName = updatedActivity;
              /* eslint-enable no-param-reassign */
            }
          });
        }
      });
    }
  });

  // Update local storage
  jsonString = JSON.stringify(jsonObj);
  localStorage.setItem('taskData', jsonString);

  // Update the elements in category page with new IDs
  const selectId = `${catName}, ${actName}, ${taskName}`;

  const nameSpan = document.getElementById(`name-${selectId}`);
  const descSpan = document.getElementById(`desc-${selectId}`);
  const dateSpan = document.getElementById(`date-${selectId}`);

  const newId = `${updatedCategory}, ${updatedActivity}, ${updatedName}`;

  nameSpan.setAttribute('id', `name-${newId}`);
  descSpan.setAttribute('id', `desc-${newId}`);
  dateSpan.setAttribute('id', `date-${newId}`);

  // Load category page from json to update changes
  openCategoryPage();
}

// Update data from task description to json
// eslint-disable-next-line no-unused-vars
function saveDesc(id) {
  // Redirect to other function if function invoked from category page
  if (categoryPage.style.display === 'block') {
    saveDescCatPage(id);
  }
  // id format : <taskDate-taskName>
  const taskDate = id.slice(0, 10);
  const taskName = id.slice(11);

  const day = giveDay(taskDate);

  // Get all id of the respective element spans (they're to be clicked on and edited)
  const nameId = `${id}-name`;
  const categoryId = `${id}-category`;
  const activityId = `${id}-activity`;
  const descId = `${id}-description`;

  let updatedName = document.getElementById(nameId).textContent;
  updatedName = updatedName.replace(/[^a-zA-Z0-9\s]/g, '').trim();

  let updatedCategory = document.getElementById(categoryId).textContent;
  updatedCategory = updatedCategory.replace(/[^a-zA-Z0-9\s]/g, '').trim();

  let updatedActivity = document.getElementById(activityId).textContent;
  updatedActivity = updatedActivity.replace(/[^a-zA-Z0-9\s]/g, '').trim();

  let updatedDesc = document.getElementById(descId).textContent;
  updatedDesc = updatedDesc.replace(/[^a-zA-Z0-9\s]/g, '').trim();

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
            task.taskName = updatedName;
            task.days = datesList;
            task.taskDescription = updatedDesc;
            category.categoryName = updatedCategory;
            activityType.activityName = updatedActivity;
            /* eslint-enable no-param-reassign */
          }
        }
      });
    });
  });

  jsonString = JSON.stringify(jsonObj);
  localStorage.setItem('taskData', jsonString);

  if (matrix.style.display === 'block') {
    // Place matrix on the task that was clicked on
    const dateComponents = taskDate.split('/');

    const formattedDate = `${dateComponents[1]}/${dateComponents[0]}/${dateComponents[2]}`;
    const d = new Date(formattedDate);
    deviceLoad(d);
  } else if (checklistPage.style.display === 'block') {
    openChecklist();
  } else if (categoryPage.style.display === 'block') {
    openCategoryPage();
  }
  document.getElementById('detailed-desc').remove();
}

/*
  When the checkbox is clicked, identify the checkbox using it's id
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
  if (bigScreen) {
    // Go eight weeks back and display it as the first week 8 * 7 = 56
    date.setDate(date.getDate() - 56);
  } else {
    date.setDate(date.getDate() - 8);
  }

  loadMatrix(date);
}

// eslint-disable-next-line no-unused-vars
function nextMonth() {
  deleteChild();
  // Should not increment date as creating matrix puts date on next week's Sunday

  loadMatrix(date);
}

// Click to display dropdown
// eslint-disable-next-line no-unused-vars
function changeMonth() {
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

// Entry boxes for adding category
// eslint-disable-next-line no-unused-vars
function addCategory() {
  // Create input for new category name
  const categoryInputHtml = `
        <input type="text" id='new-category-name' placeholder="Category name" class="cat-page-text-input"> 
        <div class="category-input-buttons cat-page-buttons">  
          <button class="new-category-submit cat-page-add-btn" onclick="submitCategoryName()"><img src = "images/square-plus-solid.svg" width="20" alt="plus icon"/></button>
          <button class="new-category-cancel cat-page-cancel-btn" onclick="cancelCategoryAdd('category-input-html')"><img src = "images/square-minus-regular.svg" alt="xmark icon" width="20"/></button>
        <div>  
    `;
  document.getElementById('category-input-html').innerHTML = categoryInputHtml;
}

// Get data submitted in category page to json
function categoryToJson(category) {
  const index = jsonObj.findIndex((cat) => cat.categoryName === category);

  const modifiedCategory = category.replace(/[^a-zA-Z0-9\s]/g, '').trim();

  // Disallow duplicate entries
  if (index === -1) {
    const categoryJSON = { categoryName: modifiedCategory, activityTypes: [] };
    if (jsonObj === null) {
      jsonObj = [];
    }
    jsonObj.push(categoryJSON);

    // Update local storage
    jsonString = JSON.stringify(jsonObj);
    localStorage.setItem('taskData', jsonString);
  }
}

// Cancel button for removing add divisions from category page
// eslint-disable-next-line no-unused-vars
function cancelCategoryAdd(id) {
  const addDiv = document.getElementById(id);

  /*
    Entry box for category must always be displayed on top so it is set in index.html.
    Removing that will cause error when new categories are addeed later
  */

  if (id === 'category-input-html') {
    addDiv.innerHTML = '';
  } else {
    addDiv.remove();
  }
}

// eslint-disable-next-line no-unused-vars
function submitCategoryName() {
  const categoryEntry = document.getElementById('new-category-name');
  const categoryName = categoryEntry.value;

  if (categoryName.trim() === '') {
    categoryEntry.placeholder = "Can't be empty";
    return;
  }

  // Push category to json
  categoryToJson(categoryName);
  // clear input after adding category
  categoryEntry.value = '';
  cancelCategoryAdd('category-input-html');
  // Load from json to update changes
  openCategoryPage();
}

// Collapse and expand category activity container
// eslint-disable-next-line no-unused-vars
function toggleCategory(categoryId) {
  const activitiesContainers = document.querySelectorAll(`#activities-container-${categoryId}`);

  if (activitiesContainers.length > 1) {
    const secondActivitiesContainer = activitiesContainers[1];
    const toggleButton = document.querySelector(`#category-${categoryId} > button`);

    if (secondActivitiesContainer.style.display === 'none' || secondActivitiesContainer.classList.contains('collapsed')) {
      secondActivitiesContainer.style.display = 'block';
      secondActivitiesContainer.classList.remove('collapsed');
      toggleButton.innerHTML = ' <img src="images/chevron-right-icon.svg" alt="arrow left icon" width="10"/>';
    } else {
      secondActivitiesContainer.style.display = 'none';
      secondActivitiesContainer.classList.add('collapsed');
      toggleButton.innerHTML = ' <img src="images/chevron-left-icon.svg" alt="arrow left icon" width="10"/>';
    }
  }
}

// Add input boxes for adding activity
// eslint-disable-next-line no-unused-vars
function addActivity(categoryId) {
  const categoryDiv = document.getElementById(`category-${categoryId}`);
  const existingInput = categoryDiv.querySelector('.activity-input');
  if (existingInput) {
    return;
  }

  // Create input for new activity name
  const activityInputHtml = `
        <div id="activity-input" class="activity-input">
            <input type="text" id='new-activity-name-${categoryId}' class="new-activity-name cat-page-text-input" placeholder="Activity name"> 
            <div class="activity-input-buttons cat-page-buttons">  
              <button class="new-activity-submit cat-page-add-btn" onclick="submitActivityName(${categoryId})"><img src = "images/add-icon.svg" width="20" alt="plus icon"/></button>
              <button class="new-activity-cancel cat-page-cancel-btn" onclick="cancelCategoryAdd('activity-input')"><img src = "images/remove-icon.svg" width="20" alt="xmark icon"/></button>
            <div>  
        </div>
    `;

  // Insert the input field into the category div
  categoryDiv.insertAdjacentHTML('beforeend', activityInputHtml);
}

function activityToJson(categoryId, activity) {
  const catText = document.getElementById(`category-text-${categoryId}`).textContent;

  const index = jsonObj.findIndex((cat) => cat.categoryName === catText);

  const modifiedActivity = activity.replace(/[^a-zA-Z0-9\s]/g, '').trim();

  const activityjson = {
    activityName: modifiedActivity,
    Tasks: [],
  };

  jsonObj[index].activityTypes.push(activityjson);

  localStorage.setItem('taskData', JSON.stringify(jsonObj));
}

// eslint-disable-next-line no-unused-vars
function submitActivityName(categoryId) {
  const activityNameInput = document.getElementById(`new-activity-name-${categoryId}`);
  const activityName = activityNameInput.value;
  if (activityName.trim() === '') {
    activityNameInput.placeholder = "Can't be empty";
    return;
  }

  // Push activity name to json
  activityToJson(categoryId, activityName);

  // Load category page from json to update changes
  openCategoryPage();
}

// Collapse or expand tasks stored in activity
// eslint-disable-next-line no-unused-vars
function toggleActivity(activityId) {
  const tasksContainer = document.getElementById(`tasks-container-${activityId}`);
  const toggleButton = document.querySelector(`#activity-${activityId} > button`);

  if (tasksContainer.style.display === 'none' || tasksContainer.classList.contains('collapsed')) {
    tasksContainer.style.display = 'block';
    tasksContainer.classList.remove('collapsed');
    toggleButton.innerHTML = '<img src="images/chevron-right-icon.svg" alt="chevron right icon" width="10"/>';
  } else {
    tasksContainer.style.display = 'none';
    tasksContainer.classList.add('collapsed');
    toggleButton.innerHTML = '<img src="images/chevron-left-icon.svg" alt="chevron left icon" width="10"/>';
  }
}

// Adding entry boxes to add new tasks
// eslint-disable-next-line no-unused-vars
function addTask(activityId) {
  const activityDiv = document.getElementById(`activity-${activityId}`);
  const existingInput = activityDiv.querySelector('.task-input');

  // Prevent task input box stacking
  if (existingInput) {
    return;
  }

  // Create input fields for new task
  const taskInputHtml = `
         <div id="task-input" class="task-input">
            <input type="text" id='new-task-name-${activityId}' class="new-task-name cat-page-text-input" placeholder="Task name">
            <input type="text" id='new-task-desc-${activityId}' class="new-task-desc cat-page-text-input" placeholder="Description">
            <div class="task-input-date-div">
              <input type="date" id='new-task-date-${activityId}' class="new-task-date cat-page-text-input" placeholder="Due dates">
              <button id="new-task-day-${activityId}" class="new-task-day cat-page-text-input" onclick="showDayDropDown()">Repeat Weekly</button>
            </div>
            <div class="task-input-buttons cat-page-buttons">       
              <button id="new-task-submit" class="new-task-submit cat-page-add-btn" onclick="submitTaskName('${activityId}')"><img src = "images/add-icon.svg" width="20" alt="plus icon"/></button>
              <button id="new-task-cancel" class="new-task-cancel cat-page-cancel-btn" onclick="cancelCategoryAdd('task-input')"><img src = "images/remove-icon.svg" width="20" alt="xmark icon"/></button>
            </div>
        </div>
    `;

  // Insert the input fields into the activity div
  activityDiv.insertAdjacentHTML('beforeend', taskInputHtml);
}

function taskToJson(activityId, taskName, taskDate, taskDesc) {
  const actText = document.getElementById(`activity-text-${activityId}`).textContent;
  const taskDateList = [taskDate];

  // Remove special characters
  const modifiedTaskName = taskName.replace(/[^a-zA-Z0-9\s]/g, '').trim();

  if (!isDuplicateTask(taskDate, taskName)) {
    // Push task details to json
    const tasksJson = {
      taskName: modifiedTaskName,
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

// eslint-disable-next-line no-unused-vars
function submitTaskName(activityId) {
  const taskNameInput = document.getElementById(`new-task-name-${activityId}`);
  const taskDescInput = document.getElementById(`new-task-desc-${activityId}`);
  const taskDateInput = document.getElementById(`new-task-date-${activityId}`);
  const taskDayInput = document.getElementById('day-dropdown');
  const taskName = taskNameInput.value;
  const taskDesc = taskDescInput.value;
  let taskDate = null;

  // Task date could have been added by using date selection or day dropdown
  if (taskDayInput) {
    taskDate = taskDayInput.value;
  } else {
    taskDate = taskDateInput.value;
  }

  if (taskName.trim() === '') {
    taskNameInput.placeholder = "Can't be empty";
    return;
  }
  if (taskDesc.trim() === '') {
    taskDescInput.placeholder = "Can't be empty";
    return;
  }
  if (taskDate.trim() === '') {
    return;
  }

  // Convert date from yyyy-mm-dd to dd/mm/yyyy format
  if (!taskDayInput) {
    const dateParts = taskDate.split('-');
    taskDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
  }

  // Push task details to json
  taskToJson(activityId, taskName, taskDate, taskDesc);

  // Load category page form json to update changes
  openCategoryPage();
}

// eslint-disable-next-line no-unused-vars
function backFromCategory() {
  navMenu.classList.remove('active');
  document.getElementById('categories-container').innerHTML = '';
  categoryPage.style.display = 'none';
  header.style.display = 'block';
  deviceLoad(giveToday());
  matrix.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* activate toggle menu */
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    dropdown.style.display = 'none';
    body.classList.toggle('blur');
    const strayTaskBox = document.getElementById('stray-task-div');
    if (strayTaskBox) {
      document.getElementById('stray-task-div').remove();
    }
  });
});

// To close elements when clicking outside of them
document.addEventListener('click', (e) => {
  if (!dropdown.contains(e.target) && !document.getElementById('month-name').contains(e.target)) {
    dropdown.style.display = 'none';
  }
  if (!navMenu.contains(e.target) && !document.querySelector('.nav-toggle').contains(e.target)) {
    navMenu.classList.remove('active');
    body.classList.remove('blur');
  }
  if (!document.getElementById('add-category-button').contains(e.target) && !document.querySelector('.category-input-html').contains(e.target)) {
    cancelCategoryAdd('category-input-html');
  }
});

// Link the tasks from the search results to their respective description pages
function searchDetails(taskName) {
  jsonObj.some(
    (category) => category.activityTypes.some((activityType) => activityType.Tasks.some((task) => {
      // If task's ID has week day instead of date, get the closest date of that day and set as ID
      if (task.taskName === taskName) {
        let taskDay = task.days[0];
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const index = daysOfWeek.indexOf(taskDay);
        if (index !== -1) {
          const today = giveToday();
          // Reset to sunday and add the index to get to the desired date
          today.setDate(today.getDate() - today.getDay() + index);
          taskDay = dateFormat(today);
        } else {
          taskDay = task.days[0].slice(0, 10);
        }
        const identifier = `${taskDay}-${taskName}`;
        openDetail(identifier);
      }
      return null;
    })),
  );
}

// Function to display search results
const displaySearchResults = (results, container) => {
  const resultsContainer = document.querySelector(container);
  resultsContainer.innerHTML = '';

  if (results.length === 0) {
    resultsContainer.style.display = 'none';
    return;
  }

  results.forEach((task) => {
    const resultElement = document.createElement('div');
    resultElement.textContent = task.taskName;
    resultElement.classList.add('search-result-item');
    resultElement.onclick = () => {
      searchDetails(task.taskName);
    };
    resultsContainer.appendChild(resultElement);
  });

  resultsContainer.style.display = 'block';
};

// Perform search and display results
const performSearch = (query, container) => {
  if (!query.trim()) {
    document.querySelector(container).style.display = 'none';
    return;
  }

  const searchQuery = query.toLowerCase();
  const searchResults = [];

  // Search the jsonObj for tasks matching the query
  jsonObj.forEach((category) => {
    category.activityTypes.forEach((activity) => {
      activity.Tasks.forEach((task) => {
        if (task.taskName.toLowerCase().includes(searchQuery)) {
          searchResults.push(task);
        }
      });
    });
  });

  displaySearchResults(searchResults, container);
};

// Attach input event listeners to search inputs
const searchInputs = [document.getElementById('searchInputDesktop'), document.getElementById('searchInputMobile')];
searchInputs.forEach((input, index) => {
  const isDesktop = index === 0;
  let resultsContainerSelector;
  if (isDesktop) {
    resultsContainerSelector = '.search-results-container-desktop';
  } else {
    resultsContainerSelector = '.search-results-container-mobile';
  }

  input.addEventListener('input', (event) => {
    performSearch(event.target.value, resultsContainerSelector);
  });
});

// Intro page file upload - Template feature
function handleFile(file) {
  // Create a FileReader instance
  const reader = new FileReader();

  // eslint-disable-next-line func-names
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

      loadMatrix(date);
    } catch (error) {
      return null;
    }
    return null;
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
        footer.style.display = 'none';
      });
    }
  }
}

// Add event listener to the file input
document.getElementById('fileInput').addEventListener('change', prepareFileForConfirmation);

/*
  Prevents the No button to be clicked if the name input is empty and
  saves the name of the user to the Local Storage
*/

document.getElementById('decline-btn').addEventListener('click', (event) => {
  const userName = introFormInput.value.trim();
  if (!userName) {
    introFormInput.placeholder = 'Please enter a name';
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  localStorage.setItem('name', userName);
  displayGreeting();

  introForm.style.display = 'none';
  welcomePage.style.display = 'none';
  introFormInput.value = '';
  matrix.style.display = 'block';
  header.style.display = 'block';
});

// Open settings page when settings is cliked from hamburger menu
// eslint-disable-next-line no-unused-vars
function openSettings() {
  settingsPage.style.display = 'block';
  navMenu.classList.remove('active');
}

// eslint-disable-next-line no-unused-vars
function backFromSettings() {
  settingsPage.style.display = 'none';
  body.classList.remove('blur');
}

// eslint-disable-next-line no-unused-vars
function exportJSON() {
  jsonString = JSON.stringify(jsonObj);

  const blob = new Blob([jsonString], { type: 'application/json' });

  const downloadLink = document.createElement('a');
  downloadLink.href = window.URL.createObjectURL(blob);
  downloadLink.download = 'data.json';

  document.body.appendChild(downloadLink);

  downloadLink.click();

  document.body.removeChild(downloadLink);
}

// reset local storage button
// eslint-disable-next-line no-unused-vars
function resetLocalStorage() {
  // eslint-disable-next-line no-alert, no-restricted-globals
  if (confirm('Are you sure you want to reset all saved data? This action cannot be undone.')) {
    localStorage.clear();
    jsonObj = [];
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  }
}

// Call displayGreeting on page load to handle page reloads
document.addEventListener('DOMContentLoaded', () => {
  displayGreeting();
});
