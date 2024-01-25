// Ensure use of Airbnb Javascript style guide.
const tasksJson = [];
function openTaskForm() {
  document.getElementById('task-window').style.display = 'flex';
}

function closeTaskForm() {
  document.getElementById('task-window').style.display = 'none';
}

const taskForm = document.getElementById('task-form');

function createJson() {
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
  tasksJson.push(newTask);
  console.log(JSON.stringify(tasksJson));
  taskForm.reset();
}
