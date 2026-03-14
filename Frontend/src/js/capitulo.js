btnBack = document.querySelector('.btn-voltar');
const urlParams = new URLSearchParams(window.location.search);
let livroAtual = urlParams.get('livro') || 'gn';
let capituloAtual = parseInt(urlParams.get('cap')) || 1;

document.addEventListener('DOMContentLoaded', () => {
    const btnBack = document.querySelector('.btn-voltar');
    

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
        const response = await fetch(`http://localhost:3000/api/capitulo/${livroAtual}/${capituloAtual}`);
        const data = await response.json();

        console.log("Dados recebidos da API:", data);

        titulo.innerText = `${data.book.name} ${data.chapter.number}`;
        numCap.innerText = data.chapter.number;

        lista.innerHTML = data.verses.map(v => `
            <div class="versiculo" onclick="abrirMenuVersiculo(event, ${v.number})">

                <p>
                    <span class="v-num">${v.number}</span> ${v.text}
                </p>

                <div class="menu-versiculo" id="menu-${v.number}">
                    <button onclick="event.stopPropagation(); favoriteVerse('${data.book.name}', ${data.chapter.number}, ${v.number})">
                        <i class="fa-solid fa-heart"></i> Favoritar
                    </button>
                </div>

            </div>
        `).join('');
    } catch (error) {
        titulo.innerHTML = "Erro ao carregar";
        lista.innerHTML = "<p>Não foi possível encontrar este capítulo.</p>"
    }
}


let menuAberto = null;

function abrirMenuVersiculo(event, verse){

    event.stopPropagation();

    const menu = document.getElementById(`menu-${verse}`);

    if(menuAberto && menuAberto !== menu){
        menuAberto.classList.remove("menu-show");
    }

    menu.classList.toggle("menu-show");

    menuAberto = menu.classList.contains("menu-show") ? menu : null;

}

document.addEventListener("click", () => {

    if(menuAberto){
        menuAberto.classList.remove("menu-show");
        menuAberto = null;
    }

});

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

function favoriteVerse(book, chapter, verse){
    fetch("http://localhost:3000/favorite", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            userId: user.id,
            book: book,
            chapter: chapter,
            verse: verse
        })
    })
    .then(res => res.json())
    .then(data => {

        alert("Versículo salvo nos favoritos ❤️");

    });
}

window.abrirSeletorCapitulos = async function() {
    const modal = document.getElementById('modal-capitulos');
    const grid = document.getElementById('grid-capitulos');
    
    if (!modal) {
        console.error("Modal não encontrado! Verifique se colou o HTML do modal.");
        return;
    }

    modal.style.display = "flex";
    grid.innerHTML = "Carregando...";

    try {
        const response = await fetch(`http://localhost:3000/api/livro-info/${livroAtual}`);
        const livroInfo = await response.json();
        
        grid.innerHTML = ""; 
        
        for (let i = 1; i <= livroInfo.chapters; i++) {
            const btn = document.createElement('button');
            btn.className = "btn-cap-select";
            btn.innerText = i;
            if(i === capituloAtual) btn.classList.add('active');
            
            btn.onclick = () => {
                capituloAtual = i;
                const novaUrl = `?livro=${livroAtual}&cap=${capituloAtual}`;
                window.history.pushState({}, '', novaUrl);
                carregarCapitulo();
                fecharModal();
            };
            grid.appendChild(btn);
        }
    } catch (error) {
        grid.innerHTML = "Erro ao carregar capítulos.";
    }
}

window.fecharModal = function() {
    const modal = document.getElementById('modal-capitulos');
    if(modal) modal.style.display = "none";
}


window.abrirSeletorCapitulos = abrirSeletorCapitulos;
window.fecharModal = fecharModal;

console.log("JS carregado e funções exportadas!");