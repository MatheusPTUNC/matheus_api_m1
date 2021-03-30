// importando a biblioteca 'express'
const express = require('express');
// importando as funcionalidades do 'express' para trabalho com rotas
const router = express.Router();
// importando o 'model' do usuário
const Users = require('../models/user');

// criando os 'endpoints' para as rotas
// raiz
router.get('/', (req,res) => {
    // obtendo os usuários no banco
    Users.find({}, (err,data) => {
        if (err) return res.send({ error: 'Ocorreu um erro na busca dos usuários!' });
        return res.send(data);
    });
})

// criando um 'endpoint' para a rota de criação de usuários
router.post('/create', (req,res) => {
    // atribuindo os campos do corpo da requisição às variáveis
    const { name, email, password } = req.body;
    
    // testando se todos os campos obrigatórios foram informados
    if (!name || !email || !password) return res.send({ error: 'Verifique se todos os campos obrigatórios foram informados! '});
    
    // verificando se o usuário/email já está cadastrado
    Users.findOne({ email }, (err, data) => {
        if (err) return res.send({ error: 'Erro ao buscar o usuaŕio na base!' });
        if (data) return res.send({ error: 'Usuário/E-Mail já cadastrado!' });

        // se não retornar nenhum dos erros acima, prossegue com a criação do usuário
        Users.create(req.body, (err, data) => {
            if (err) return res.send({ error: 'Erro ao criar o usuaŕio!' });
            return res.send(data);
        });
    });
});


// exportando o módulo
module.exports = router;