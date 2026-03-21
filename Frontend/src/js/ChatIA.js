const textarea = document.getElementById('text-action');

// Ajusta a altura do textarea automaticamente conforme o usuário digita
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

    // --- EFEITO DE CARREGAMENTO ---
    responseArea.style.opacity = "0.5";
    responseArea.innerText = "Buscando sabedoria nas Escrituras...";
    input.value = ""; // Limpa o campo de texto
    input.style.height = 'auto'; // Reseta a altura do textarea

    try {
        // Faz a chamada para o seu servidor (que agora usa a Groq)
        const response = await fetch('http://localhost:3000/perguntar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pergunta })
        });

        const data = await response.json();

        // Se o servidor retornar a resposta da IA
        if (data.resposta) {        
            responseArea.innerText = data.resposta;
        } 
        // Se o servidor retornar um erro tratado
        else if (data.erro) {
            responseArea.innerText = "Ops! " + data.erro;
        } 
        // Se vier algo inesperado
        else {
            responseArea.innerText = "Não consegui obter uma resposta no momento.";
        }

    } catch (error) {
        // Erro de conexão (servidor desligado, por exemplo)
        responseArea.innerText = "Erro ao conectar com o servidor. Verifique se o backend está rodando.";
        console.error("Erro no fetch:", error);
    } finally {
        // Volta a opacidade ao normal
        responseArea.style.opacity = "1";
    }
});

// Permite enviar com "Enter" (opcional, mas melhora muito a experiência)
textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        btnSubmit.click();
    }
});