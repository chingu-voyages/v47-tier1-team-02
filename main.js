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
            taskName: taskName,
            taskDescription: taskDesc,
            days: [days],
          },
        ],
      },
    ],
  };
  console.log(JSON.stringify(newTask));
});
