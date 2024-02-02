// Ensure use of Airbnb Javascript style guide.

/* activate toggle menu */
document.addEventListener("DOMContentLoaded", function () {
    let navToggle = document.querySelector(".nav-toggle");
    let navMenu = document.getElementById("nav-menu");

    navToggle.addEventListener("click", function () {
       navMenu.classList.toggle("active");
    });
 });

 /* search functionality */
 document.getElementById('searchInput').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
      event.preventDefault(); 
      performSearch();
  }
});

function performSearch() {
  let query = document.getElementById('searchInput').value;
  console.log('Searching for:', query);
}
