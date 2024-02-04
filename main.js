// Ensure use of Airbnb Javascript style guide.

/* activate toggle menu */
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });


/* search functionality */
  const performSearch = (query) => {
    console.log('Searching for:', query);
  };

  const searchInputs = [document.getElementById('searchInputDesktop'), document.getElementById('searchInputMobile')];

  searchInputs.forEach(input => {
    input.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault(); 
        performSearch(input.value);
      }
    });
  });
});



