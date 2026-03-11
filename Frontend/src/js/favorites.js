const user = JSON.parse(localStorage.getItem("user"));
const back = document.getElementById("btn-back");

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
            📖 <strong>${f.book} ${f.chapter}:${f.verse}</strong>
            </p>

        </div>
    `).join('');

}

async function buscarTextoVersiculo(book, chapter, verse) {
    try {
        const response = await fetch (`/api/capitulo/${book}/${chapter}`);
        const dados = await  response.json();

        const versiculoEncontrado = dados.verses.find(v => v.number == verse);

        if (versiculoEncontrado) {
            exibirNaTela(book, chapter, number.verse, versiculoEncontrado.text);
        } else {
            alert("Versículo não encontrado.");
        }
    } catch (erro) {
        console.error("Erro ao buscar:", erro);
    }
}

carregarFavoritos();
//buscarTextoVersiculo();

back.addEventListener("click", () =>{
    window.location.href = "index.html"
});