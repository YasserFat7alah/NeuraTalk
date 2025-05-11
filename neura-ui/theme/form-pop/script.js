const wrapper = document.querySelector('.wrapper');
const black = document.querySelector(".black");
const close = document.querySelector('.icon-close');
const loginPopup = document.querySelector('.btnLogin-popup');

const loginForm = document.querySelector('.login');
const registerForm = document.querySelector('.register');
const loginLink =document.querySelector('.login-link');
const registerLink =document.querySelector('.register-link');

close.addEventListener('click', () => {
    wrapper.classList.remove('active');
    black.classList.remove('active');
});

loginPopup.addEventListener('click', () => {
    wrapper.classList.add('active');
    black.classList.add('active');

    loginForm.classList.remove('hide');
    registerForm.classList.add('hide');
});

loginLink.addEventListener('click', () => {
    if(wrapper.classList.contains('active')){ 
        black.classList.add('active');
   
        loginForm.classList.remove('hide');
        registerForm.classList.add('hide');
    }
});

registerLink.addEventListener('click', () => {
    if(wrapper.classList.contains('active')){  
        black.classList.add('active');
  
        loginForm.classList.add('hide');
        registerForm.classList.remove('hide');
    }
});