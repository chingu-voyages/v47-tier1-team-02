// Ensure use of Airbnb Javascript style guide.

/* activate toggle menu */
document.addEventListener("DOMContentLoaded", function () {
    let navToggle = document.querySelector(".nav-toggle");
    let navMenu = document.getElementById("nav-menu");

    navToggle.addEventListener("click", function () {
       navMenu.classList.toggle("active");
    });
 });