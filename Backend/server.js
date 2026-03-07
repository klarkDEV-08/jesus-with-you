const db = require("./db");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");  
require('dotenv').config();
const path = require('path');

const token = process.env.BIBLIA_TOKEN;
const app = express();

app.use(cors());  
app.use(express.static(path.join(__dirname, 'Frontend')));

app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
});

app.get("/versiculo", async (req, res) => {
    try {
        const response = await fetch("https://www.abibliadigital.com.br/api/verses/nvi/random", {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('API falhou');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar versículo" });
    }
});

app.get('/api/capitulo/:livro/:capitulo', async (req, res) =>{
    const {livro, capitulo} = req.params;
    const versao = 'nvi';

    try {
        const url = `https://www.abibliadigital.com.br/api/verses/${versao}/${livro}/${capitulo}`

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`}
        });
        const dados = await response.json();
        res.json(dados);
    } catch (erro) {
        res.status(500).json({ error: 'Erro ao buscar capítulo'});
    }
});

app.post("/register", async (req, res) =>{
    console.log(req.body);

    try {
        const { nome , email, senha} = req.body;

        if(!nome || !email || !senha) {
            return res.status(400).json({ message: "Preencha todos os campos"});
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const sql = "INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)";

        db.query(sql, [nome, email, senhaHash], (err, result) => {
        if(err) {
            console.error(err);

            if(err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Email já cadastrado"});
            }

            return res.status(500).json({ message: "Erro ao cadastrar usuário"});
        }
    
        res.status(201).json({message: "Usuário cadastrado com sucesso!"});
});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno"});
    }
});

app.post("/login", (req, res) => {
    const { email, senha } = req.body;

    if(!email || !senha){
        return res.status(400).json({ message: "Preencha todos os campos"});
    }

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).json({ message: "Erro no servidor"});
        }

        if(result.length === 0){
            return res.status(401).json({ message: "Usuário não encontrado"});
        }

        const usuario = result[0];
        
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if(!senhaCorreta){
            return res.status(401).json({ message: "Senha incorreta"});
        }
        res.json({ 
            message: "Login realizado com sucesso!",
            user: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });
    });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 http://localhost:${PORT}`);
});
