const toggle = document.getElementById('toggle-eye');
const pass = document.getElementById('senha');
const form = document.getElementById('loginForm');

// mostrar ou esconder senha
toggle.addEventListener('click', () => {
    if (pass.type === 'password') {
        pass.type = 'text';
        toggle.classList.remove('fa-eye');
        toggle.classList.add('fa-eye-slash');
    } else {
        pass.type = 'password';
        toggle.classList.remove('fa-eye-slash');
        toggle.classList.add('fa-eye');
    }
});

// quando enviar o formulário
form.addEventListener('submit', async (e) => {

    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {

        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                senha: senha
            })
        });

        const data = await response.json();

        console.log(data);

        if(response.ok){

            alert(data.message);
            localStorage.setItem("user", JSON.stringify(data.user));

            window.location.href = "index.html";

        }else{

            alert(data.message);

        }

    } catch (error) {

        console.error("Erro:", error);

    }

});