const textarea = document.getElementById('text-action');

textarea.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

const btnSubmit = document.getElementById('_submitBtnChat');
const input = document.getElementById('text-action');
const responseArea = document.getElementById('_responseChat');

btnSubmit.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const pergunta = input.value.trim();
    if (!pergunta) return;

    // Efeito de "carregando"
    responseArea.style.opacity = "0.5";
    responseArea.innerText = "Buscando nas Escrituras...";
    input.value = ""; // Limpa o campo

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
        responseArea.innerText = "Erro ao conectar com o servidor.";
        console.error(error);
    } finally {
        responseArea.style.opacity = "1";
    }
});