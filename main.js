// Follows Airbnb Javascript style guide.

const jsonString = [
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
              'Tuesday',
            ],
            completion: [],
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

document.addEventListener('DOMContentLoaded', () => {
  const date = new Date();
  const dayNum = date.getDay();

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

    /* Find each task's day in json and if it is same as the day of element under construction.
    If it is, add the task name under the constructed header. */
    jsonString.forEach((category) => {
      category.activityTypes.forEach((activityType) => {
        activityType.Tasks.forEach((task) => {
          task.days.forEach((dayN) => {
            if (dayN === day) {
              const taskElement = document.createElement('div');

              // Division for individual task name and checkbox
              taskElement.classList.add('task-element');

              taskElement.innerHTML = `
                  <label class="checkbox-label" for="${fDate}-${task.taskName}-checkbox"> ${task.taskName} </label>
                  <input type="checkbox" id="${fDate}-${task.taskName}-checkbox" name="task-checkbox" value="checked" onchange="checkboxStore('${fDate}-${task.taskName}-checkbox')">
              `;
              taskList.appendChild(taskElement);
            }
          });
        });
      });
    });

    dayDiv.appendChild(dayHeader);
    dayDiv.appendChild(taskList);

    daysContainer.appendChild(dayDiv);
  });
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
function checkboxStore(id) {
  const date = id.slice(0, 10);
  const name = id.slice(11, -9);

  jsonString.forEach((category) => {
    category.activityTypes.forEach((activityType) => {
      activityType.Tasks.forEach((task) => {
        if (task.taskName === name) {
          const index = task.completion.indexOf(date);
          if (index !== -1) {
            task.completion.splice(index, 1);
          } else {
            task.completion.push(date);
          }
        }
      });
    });
  });
  // console.log(jsonString);
}
