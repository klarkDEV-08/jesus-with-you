const menuTrigger = document.getElementById('menu-trigger');
const themeBtn = document.getElementById('theme-toggle');
const textBtn = document.getElementById('change-mode');
const dropdown = document.getElementById('menu-dropdown');
const backHome = document.getElementById('btn-back-home');



menuTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('hidden');
});

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const icon = themeBtn.querySelector('i');
    if (document.body.classList.contains('light-mode')) {
        icon.classList.replace('fa-moon', 'fa-sun');
        textBtn.innerText = 'Modo Escuro';
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
        textBtn.innerText = 'Modo Claro';
    }
});

window.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== menuTrigger) {
        dropdown.classList.add('hidden');
    }
});

backHome.addEventListener('click', () => {
    window.location.href = "index.html";
});
