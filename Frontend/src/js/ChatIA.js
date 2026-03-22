const textarea = document.getElementById('text-action');
const btnSubmit = document.getElementById('_submitBtnChat');
const responseArea = document.getElementById('_responseChat');

const btnCopy = document.getElementById('btn-copiar'); 
const iconCopy = document.getElementById('toggle-copy');

const themeBtn = document.getElementById('theme-toggle');
const menuTrigger = document.getElementById('menu-trigger');
const dropdown = document.getElementById('menu-dropdown');
const backHome = document.getElementById('btn-back-home');
const textBtn = document.getElementById('change-mode');

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

textarea.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

btnSubmit.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const pergunta = textarea.value.trim();
    if (!pergunta) return;

    responseArea.style.opacity = "0.5";
    responseArea.innerText = "Buscando sabedoria nas Escrituras...";
    textarea.value = ""; 
    textarea.style.height = 'auto'; 

    try {
        const response = await fetch('http://localhost:3000/perguntar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pergunta })
        });

        const data = await response.json();

        if (data.resposta) {        
            responseArea.innerText = data.resposta;
        } else if (data.erro) {
            responseArea.innerText = "Ops! " + data.erro;
        } else {
            responseArea.innerText = "Não consegui obter uma resposta no momento.";
        }

    } catch (error) {
        responseArea.innerText = "Erro ao conectar com o servidor. Verifique se o backend está rodando.";
        console.error("Erro no fetch:", error);
    } finally {
        responseArea.style.opacity = "1";
    }
});

textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        btnSubmit.click();
    }
});

async function copiarConteudo() {
    const textoParaCopiar = responseArea.innerText;
    
    if (!textoParaCopiar || textoParaCopiar === "Aguardando sua pergunta...") return;

    try {
        await navigator.clipboard.writeText(textoParaCopiar);

        if (btnCopy) btnCopy.style.background = "#28a745";
        if (iconCopy) {
            iconCopy.classList.replace("fa-regular", "fa-solid");
            iconCopy.classList.add("fa-check");
        }

        setTimeout(() => {
            if (btnCopy) btnCopy.style.background = "";
            if (iconCopy) {
                iconCopy.classList.replace("fa-solid", "fa-regular");
                iconCopy.classList.remove("fa-check");
            }
        }, 2000);

    } catch (err) {
        console.error('Erro ao copiar: ', err);
    }
}

if (btnCopy) {
    btnCopy.addEventListener('click', copiarConteudo);
}