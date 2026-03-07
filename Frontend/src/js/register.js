const form = document.getElementById("registerForm");
const toggle = document.getElementById("toggle-eye");
const pass = document.getElementById("senha");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;

  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem!");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: nome,
        email: email,
        senha: senha,
      }),
    });

    const data = await response.json();

    document.getElementById("register-message").innerText = data.message;

  } catch (error) {
    console.error("Erro:", error);
  }
});

toggle.addEventListener("click", () =>{
  if(senha.type === "password"){
    senha.type = "text";
    toggle.classList.remove("fa-eye");
    toggle.classList.add("fa-eye-slash");
  } else {
    senha.type = "password";
    toggle.classList.remove("fa-eye-slash");
    toggle.classList.add("fa-eye");
  }
});