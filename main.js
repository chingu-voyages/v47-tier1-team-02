// Ensure use of Airbnb Javascript style guide.

document.addEventListener('DOMContentLoaded', () => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const daysContainer = document.getElementById('mobile-table');

  daysOfWeek.forEach((day) => {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('days');

    const dayHeader = document.createElement('div');
    dayHeader.classList.add('day-header');
    dayHeader.innerHTML = `
            <button type="button">+</button>
            <span class="day-name">${day}</span>
        `;

    const taskList = document.createElement('div');
    taskList.classList.add('task-list');

    for (let i = 1; i <= 2; i += 1) {
      const taskElement = document.createElement('div');
      taskElement.classList.add('task-element');
      taskElement.innerHTML = `
                <label class="checkbox-label" for="${day}${i}-checkbox"> Task ${i}</label>
                <input type="checkbox" id="${day}${i}-checkbox" name="task-checkbox" value="checked">
            `;
      taskList.appendChild(taskElement);
    }

    dayDiv.appendChild(dayHeader);
    dayDiv.appendChild(taskList);

    daysContainer.appendChild(dayDiv);
  });
});

// Ensure use of Airbnb Javascript style guide.

function openTaskForm() {
  document.getElementById('task-window').style.display = 'flex';
}

function closeTaskForm() {
  document.getElementById('task-window').style.display = 'none';
}

const taskForm = document.getElementById('task-form');

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const category = document.getElementById('category').value;
  const activity = document.getElementById('activity').value;
  const taskName = document.getElementById('task-name').value;
  const taskDesc = document.getElementById('task-desc').value;
  const days = document.getElementById('days').value;

  const newTask = {
    categoryName: category,
    activityTypes: [
      {
        activityName: activity,
        Tasks: [
          {
            taskName,
            taskDescription: taskDesc,
            days: [days],
          },
        ],
      },
    ],
  };
  console.log(newTask);
});
