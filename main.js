

// the button will render the new tasks added to local storage from the category page on the checklist page
document.getElementById("checklist-add-btn").addEventListener('click', () => {
    renderTasksToChecklist()
})

//to render the Checklist page upon loading the page

window.addEventListener('DOMContentLoaded', renderChecklist)

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

