// Ensure use of Airbnb Javascript style guide.
document.addEventListener('DOMContentLoaded', function () {
  // Function to add a new item to the list
  function addNew(type) {
      const itemName = prompt(`Enter the name for the new ${type}:`);
      if (itemName) {
          const newItem = document.createElement('li');
          newItem.textContent = itemName;
          const list = document.getElementById(`${type}List`);
          list.appendChild(newItem);
      }
  }

  // Event listener for the "plus" buttons
  function addButtonListeners() {
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
          button.addEventListener('click', function () {
              const type = this.parentNode.textContent.trim().split(' ')[0].toLowerCase();
              addNew(type);
          });
      });
  }

  addButtonListeners();
});
