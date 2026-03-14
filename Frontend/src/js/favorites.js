const user = JSON.parse(localStorage.getItem("user"));
const modal = document.getElementById("modalVersiculo");
const modalTitulo = document.getElementById("modal-titulo");
const modalTexto = document.getElementById("modal-texto");
const btnFechar = document.querySelector(".fechar-modal");
const themeBtn = document.getElementById('theme-toggle');
const menuTrigger = document.getElementById('menu-trigger');
const dropdown = document.getElementById('menu-dropdown');
const backHome = document.getElementById('btn-back-home');

const dicionarioLivros = {
    "Gênesis": "gn", "Êxodo": "ex", "Levítico": "lv", "Números": "nm",
    "Deuteronômio": "dt", "Josué": "js", "Juízes": "jz", "Rute": "rt",
    "1 Samuel": "1sm", "2 Samuel": "2sm", "1 Reis": "1kgs", "2 Reis": "2kgs",
    "1 Crônicas": "1cr", "2 Crônicas": "2cr", "Esdras": "ezr", "Neemias": "ne",
    "Ester": "et", "Jó": "job", "Salmos": "sl", "Provérbios": "pv",
    "Eclesiastes": "ec", "Cânticos": "ct", "Isaías": "is", "Jeremias": "jr",
    "Lamentações": "lm", "Ezequiel": "ez", "Daniel": "dn", "Oséias": "os",
    "Joel": "jl", "Amós": "am", "Obadias": "ob", "Jonas": "jn",
    "Miquéias": "mq", "Naum": "na", "Habacuque": "hc", "Sofonias": "sf",
    "Ageu": "ag", "Zacarias": "zc", "Malaquias": "ml", "Mateus": "mt",
    "Marcos": "mc", "Lucas": "lc", "João": "jo", "Atos": "act",
    "Romanos": "rm", "1 Coríntios": "1co", "2 Coríntios": "2co", "Gálatas": "gl",
    "Efésios": "ef", "Filipenses": "fp", "Colossenses": "cl", "1 Tessalonicenses": "1ts",
    "2 Tessalonicenses": "2ts", "1 Timóteo": "1tm", "2 Timóteo": "2tm", "Tito": "tt",
    "Filemon": "fm", "Hebreus": "hb", "Tiago": "tg", "1 Pedro": "1pe",
    "2 Pedro": "2pe", "1 João": "1jo", "2 João": "2jo", "3 João": "3jo",
    "Judas": "jd", "Apocalipse": "ap"
};

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

backHome.addEventListener('click', () => {
    window.location.href = "index.html";
});

if (!user) {
    window.location.href = "login.html";
}

const lista = document.getElementById("favoritos-list");

async function carregarFavoritos(){

    const res = await fetch(`http://localhost:3000/favorites/${user.id}`);

    const favoritos = await res.json();

    if(favoritos.length === 0){
        lista.innerHTML = "<p>Você ainda não tem favoritos.</p>";
        return;
    }

    lista.innerHTML = favoritos.map(f => `
        <div class="favorito-item" onclick="buscarTextoVersiculo('${f.book}', ${f.chapter}, ${f.verse})">

            <p>
             <i class="fa-solid fa-cross"></i> <strong>${f.book} ${f.chapter}:${f.verse}</strong>
            </p>

        </div>
    `).join('');

}

async function buscarTextoVersiculo(book, chapter, verse) {
    const bookCodigo = dicionarioLivros[book] || book.toLowerCase().trim();

    try {
        console.log(`Buscando: ${bookCodigo} ${chapter}:${verse}`);

        const response = await fetch(`http://localhost:3000/api/capitulo/${bookCodigo}/${chapter}`);
        
        if (!response.ok) throw new Error("Erro na resposta da API");

        const dados = await response.json();

        if (dados && dados.verses) {
            const versiculoEncontrado = dados.verses.find(v => v.number == verse);

            if (versiculoEncontrado) {
                modalTitulo.innerText = `${book} ${chapter}:${verse}`;
                modalTexto.innerText = versiculoEncontrado.text;
                modal.style.display = "block";
            } else {
                alert("Versículo não encontrado.");
            }
        }
    } catch (erro) {
        console.error("Erro:", erro);
        alert("Não foi possível carregar o versículo. Verifique se o servidor está rodando.");
    }
}

btnFechar.onclick = () => modal.style.display = "none";
window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
}

carregarFavoritos();

back.addEventListener("click", () =>{
    window.location.href = "index.html"
});
