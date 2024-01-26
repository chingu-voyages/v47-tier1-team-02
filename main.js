// Ensure use of Airbnb Javascript style guide.


const intro = document.getElementById('intro')
const introForm = document.getElementById('intro-form')
const welcomePage = document.getElementById('welcome-page')
const introFormInput = document.getElementById('introForm-input')
const userName = localStorage.getItem('name');


document.addEventListener('click', (e) => {
    if (e.target.id === 'start-btn'){
        welcomePage.style.display = 'none'
        introForm.style.display = 'block'
    }
    else if (e.target.id ==='decline-btn'){
        introForm.style.display = 'none'
        welcomePage.style.display = 'block'
        introFormInput.value = "";
    }
})


introForm.addEventListener('submit', (e) =>{
    e.preventDefault()

    const introFormData = new FormData(introForm)
    const inputValue = introFormData.get('user')

    localStorage.setItem("name", inputValue);
    
    introFormInput.value = "";
    intro.style.display = "none"
})
