// importando a biblioteca 'express'
const express = require('express');
// importando as funcionalidades do 'express' para trabalho com rotas
const router = express.Router();
// importando o 'model' do usuário
const Users = require('../models/user');
// importando a biblioteca 'bcrypt'
const bcrypt = require('bcrypt');
// importando a biblioteca 'jsonwebtoken'
const jwt = require('jsonwebtoken');
// importando o middleware de autenticação
const auth = require('../middlewares/auth');
// importando a biblioteca para configurações
const config = require('../config/config');

/**
 * FUNÇÕES AUXILIARES
 * 
 * criando a função para a criação do token do usuário
 */
const createUserToken = (userId) => {
    return jwt.sign({ 
        id: userId }, 
        config.jwtPass,
        { expiresIn: config.jwtExpires });
};

// criando o endpoint para autenticar na API
router.post('/auth', (req,res) => {
    const { email, password } = req.body;
    // testando se email ou senha não foram informados
    if (!email || !password)
        return res.send({ error: 'Dados inválidos! '});
    // se foram informados
    Users.findOne({ email }, (err, data) => {
        if (err)
            return res.send({ error: 'Erro ao buscar usuário!' });
        if (!data)
            return res.send({ error: 'Usuário não encontrado! '});
        // caso não ocorra nenhuma das situações acima
        // comparar a senha informada com a senha salva
        bcrypt.compare(password,data.password, (err,same) => {
            // testando se as senhas não são iguais
            if (!same)
                return res.send({ error: 'Erro na autenticação!'});
            // se as senhas forem iguais
            // impedindo o retorno da senha
            data.password = undefined;
            return res.send({ data, token: createUserToken(data.id) });
        });
    }).select('+password');
});

// criando o endpoint para listar todo os usuários
router.get('/', auth, async (req,res) => {
    try {
        // criando um objeto para receber os usuários
        const users = await Users.find({});
        return res.send(users);
    }
    catch (err) {
        return res.status(500).send({ error: 'Erro na busca dos usuários!' });
    }
});

// criando o endpoint para salvar usuário
router.post('/create', auth, async (req,res) => {
    const { name, username, phone, email, password } = req.body;
    console.log(`${name} - ${username} - ${phone} - ${email} - ${password}`);
    // testando se todos os campos obrigatórios foram informados
    if (!name || !username || !email || !password) 
        return res.send({ error: 'Verifique se todos os campos obrigatórios foram informados! '});
    try {
        // verificando se o usuário/email já está cadastrado
        if (await Users.findOne({ username, email }))
            return res.send({ error: 'Usuário já cadastrado! '});
        // se o usuário ainda nao for cadastrado
        const user = await Users.create(req.body);
        // impedindo o retorno da senha
        user.password = undefined;
        return res.status(201).send({ user, token: createUserToken(user.id) });
    }
    catch (err) {
        return res.send({ error: `Erro ao gravar o usuário: ${err}`})
    }
});

// criando o endpoint para alterar usuário
router.put('/update/:id', auth, async (req,res) => {
    const { name, username, phone, email, password } = req.body;
    if (!name || !username || !email || !password) 
        return res.send({ error: 'Verifique se todos os campos obrigatórios foram informados! '});
    try {
        // verificando se o usuário/email já está cadastrado
        if (await Users.findOne({ username, email }))
            return res.send({ error: 'Usuário já cadastrado! '});
        // se o usuário ainda nao for cadastrado
        const user = await Users.findByIdAndUpdate(req.params.id, req.body);
        const userChanged = await Users.findById(req.params.id);
        // impedindo o retorno da senha
        userChanged.password = undefined;
        return res.status(201).send({ userChanged, token: createUserToken(userChanged.id) });
    }
    catch (err) {
        return res.send({ error: `Erro ao atualizar o usuário: ${err}`})
    }     
});

// criando o endpoint para apagar usuário
router.delete('/delete/:id', auth, async (req,res) => {
    try {
        await Users.findByIdAndDelete(req.params.id);
        return res.send({ error: 'Usuário removido!' });
    }
    catch (err) {
        return res.send({ error: 'Erro ao remover usuário!' });
    }     
});

// exportando o módulo
module.exports = router;