
const menuTrigger = document.getElementById('menu-trigger');
const dropdown = document.getElementById('menu-dropdown');
const themeBtn = document.getElementById('theme-toggle');
const textBtn = document.getElementById('change-mode');
const instagram = document.getElementById('instagram');
const tikTok = document.getElementById('tiktok');
const youtube = document.getElementById('youtube');
const logoutBtn = document.getElementById("logout-btn");
const favoritesBtn = document.getElementById("btn-favorites");


menuTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('hidden');
});

window.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== menuTrigger) {
        dropdown.classList.add('hidden');
    }
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

async function carregarVersiculo() {
    try {
        const resposta = await fetch('http://localhost:3000/versiculo');
        if (!resposta.ok) throw new Error("Erro ao buscar");
        const dado = await resposta.json();
        document.getElementById("versiculo").innerText = dado.text;
        document.getElementById("book").innerText = `${dado.book?.name || dado.book} ${dado.chapter}:${dado.number}`;
    } catch (erro) {
        console.error('Erro:', erro);
        document.getElementById("versiculo").innerText = "Jesus te ama!";
        document.getElementById("book").innerText = "Abra seu coração";
    }
}

document.addEventListener('DOMContentLoaded', carregarVersiculo);

document.querySelectorAll('.capitulos-AT, #capitulos-NV').forEach(livro => {
    livro.addEventListener('click', function() {
        const abrev = this.getAttribute('data-livro');
        
        if (abrev) {
            window.location.href = `capitulo.html?livro=${abrev}&cap=1`;
        } else {
            console.error("Esqueceu de colocar o data-livro neste item!");
        }
    });
});


instagram.addEventListener('click', () =>{
    window.open('https://www.instagram.com/jesuswithyou._/?__pwa=1#');
});

tikTok.addEventListener('click', () =>{
    window.open('https://www.tiktok.com/@1minutocomcrist0');
});


const loginForm = document.getElementById("loginForm");

if(loginForm){

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        document.getElementById("login-message").innerText = data.message;

        if(response.ok){
            window.location.href = "index.html";
        }

    });

}

const user = JSON.parse(localStorage.getItem("user"));

if(user){
    const userName = document.getElementById("user-name");

    if(userName){
        userName.innerText = `Olá, ${user.nome} 👋`;
    }
}

if(!user) {
    window.location.href = "login.html";
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "login.html";
    });
}

favoritesBtn.addEventListener("click", () => {
    window.location.href = "favorites.html";
});