const menuTrigger = document.getElementById('menu-trigger');
const themeBtn = document.getElementById('theme-toggle');
const textBtn = document.getElementById('change-mode');

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