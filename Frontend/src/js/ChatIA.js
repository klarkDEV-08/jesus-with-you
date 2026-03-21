const textarea = document.getElementById('text-action');

textarea.addEventListener('input', function() {
    this.style.height = 'auto'; // Reseta a altura
    this.style.height = (this.scrollHeight) + 'px'; // Ajusta para o tamanho do conteúdo
});