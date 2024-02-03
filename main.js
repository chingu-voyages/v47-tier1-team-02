// Ensure use of Airbnb Javascript style guide.

// 1. Adding the category
let categoryIdCounter = 1; 

function addCategory() {
    // Create input for new category name
    const categoryInputHtml = `
        <input type="text" id='new-category-name' placeholder="Category name"> 
        <button onclick="submitCategoryName()">Add</button>
    `;
    document.getElementById('category-entry').innerHTML = categoryInputHtml;
}

function submitCategoryName() {
    const categoryName = document.getElementById('new-category-name').value;
    if (categoryName.trim() === '') {
        alert('Category name cannot be empty');
        return;
    }
    
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
    
    categoryIdCounter++;
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

    const activitiesContainer = document.getElementById(`activities-container-${categoryId}`);
    // Calculate new activity ID based on existing activities
    const existingActivities = activitiesContainer.getElementsByClassName('activity');
    const activityNumber = existingActivities.length + 1;
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
        <div class="task-input">
            <input type="text" id='new-task-name-${activityId}' class="new-task-name" placeholder="Task name">
            <input type="text" id='new-task-desc-${activityId}' class="new-task-desc" placeholder="Description">
            <input type="text" id='new-task-date-${activityId}' class="new-task-date" placeholder="Due dates" onfocus="(this.type='date')">
            <button onclick="submitTaskName('${activityId}')">Add</button>
        </div>
    `;
    
    // Insert the input fields into the activity div
    activityDiv.insertAdjacentHTML('beforeend', taskInputHtml);
}

function submitTaskName(activityId) {
    const taskNameInput = document.getElementById(`new-task-name-${activityId}`);
    const taskDescInput = document.getElementById(`new-task-desc-${activityId}`);
    const taskDateInput = document.getElementById(`new-task-date-${activityId}`);
    const taskName = taskNameInput.value;
    const taskDesc = taskDescInput.value;
    let taskDate = taskDateInput.value;

    if (taskName.trim() === '' || taskDesc.trim() === '' || taskDate.trim() === '') {
        alert('Task name, description, and due date cannot be empty');
        return;
    }

    // Convert date from yyyy-mm-dd to dd/mm/yyyy format
    if (taskDate) {
        const dateParts = taskDate.split('-'); 
        taskDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; 
    }

    const tasksContainer = document.getElementById(`tasks-container-${activityId}`);
    // Calculate new task ID based on existing tasks
    const existingTasks = tasksContainer.getElementsByClassName('task');
    const taskNumber = existingTasks.length + 1;
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
    getTasksToChecklist(taskName, taskDate, taskId)

    // Remove the input fields after adding the task
    taskNameInput.parentElement.remove();
}


