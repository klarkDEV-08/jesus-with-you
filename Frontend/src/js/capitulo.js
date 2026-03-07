btnBack = document.querySelector('btn-voltar');
const urlParams = new URLSearchParams(window.location.search);
let livroAtual = urlParams.get('livro') || 'gn';
let capituloAtual = parseInt(urlParams.get('cap')) || 1;

document.addEventListener('DOMContentLoaded', () => {
    const btnBack = document.querySelector('.btn-voltar');
    
    // Verificamos se ele realmente existe antes de usar
    if (btnBack) {
        btnBack.addEventListener('click', () => {
            window.location.href = "index.html";
        });
    } else {
        console.error("Botão .btn-voltar não foi encontrado no HTML!");
    }
});

async function carregarCapitulo() {
    const titulo = document.getElementById('titulo-capitulo');
    const lista = document.getElementById('versiculos-list');
    const numCap = document.getElementById('num-cap');

    try {
        // Dentro da função carregarCapitulo()
        const response = await fetch(`http://localhost:3000/api/capitulo/${livroAtual}/${capituloAtual}`);
        const data = await response.json();

        console.log("Dados recebidos da API:", data); // Isso vai nos mostrar tudo no Console (F12)

        titulo.innerText = `${data.book.name} ${data.chapter.number}`;
        numCap.innerText = data.chapter.number;

        // Tente mudar 'versos' para 'verses' aqui:
        lista.innerHTML = data.verses.map(v => `
            <p class="versiculo">
                <span class="v-num">${v.number}</span> ${v.text}
            </p>
        `).join('');
    } catch (error) {
        titulo.innerHTML = "Erro ao carregar";
        lista.innerHTML = "<p>Não foi possível encontrar este capítulo.</p>"
    }
}

function mudarCapitulo(direcao) {
    let novoCapitulo = capituloAtual  + direcao;

    if(novoCapitulo < 1) {
        alert("Você já está no primeiro capítulo deste livro!");
        return;
    }

    capituloAtual = novoCapitulo;

    const novaUrl = `?livro=${livroAtual}&cap=${capituloAtual}`;
    window.history.pushState({}, '', novaUrl);

    carregarCapitulo();
}
carregarCapitulo();

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "login.html";
}