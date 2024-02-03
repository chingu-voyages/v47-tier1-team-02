// Follows Airbnb JavaScript style guide

function handleFile() {
  // Get the file input element
  const fileInput = document.getElementById('fileInput');

  // Check if a file is selected
  if (fileInput.files.length > 0) {
      const file = fileInput.files[0];

  // Create a FileReader instance
      const reader = new FileReader();

      reader.onload = function (event) {
          try {
              const jsonData = JSON.parse(event.target.result);

  // Log the parsed JSON data to the console
              console.log('JSON data:', jsonData);

          } catch (error) {
  // Handle errors during JSON parsing
              console.error('Error parsing JSON file:', error);
          }
      };

  // Read the file as text
      reader.readAsText(file);
  } else {
   // Log a message if no file is selected
      console.log('No file selected.');
  }
}