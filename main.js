// Ensure use of Airbnb Javascript style guide.

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
    dayDiv.classList.add('days');

    const dayHeader = document.createElement('div');
    dayHeader.classList.add('day-header');
    dayHeader.innerHTML = `
            <button type="button">+</button>
            <span class="day-name">${day} (${dateFormat(date)})</span>
        `;
    date.setDate(date.getDate() + 1);
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
