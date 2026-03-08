const user = JSON.parse(localStorage.getItem("user"));

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
        <div class="favorito-item">

            <p>
            📖 <strong>${f.book} ${f.chapter}:${f.verse}</strong>
            </p>

        </div>
    `).join('');

}

carregarFavoritos();