// Ensure use of Airbnb Javascript style guide.

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

function addTask(activityId) {
    console.log(`Add task to activity ID: ${activityId}`);
}

