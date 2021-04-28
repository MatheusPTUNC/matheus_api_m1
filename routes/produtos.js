const express = require('express');
const router = express.Router();
const produto = require('../models/produto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const config = require('../config/config');


const createUserToken = (userId) => {
    return jwt.sign({ 
        id: userId }, 
        config.jwtPass,
        { expiresIn: config.jwtExpires });
};


router.post('/auth', (req,res) => {
    const { login, password } = req.body; 
    if (!login || !password)
        return res.send({ error: 'Dados inválidos! '});
    Users.findOne({ login }, (err, data) => {
        if (err)
            return res.send({ error: 'Erro ao buscar usuário!' });
        if (!data)
            return res.send({ error: 'Usuário não encontrado! '});
        bcrypt.compare(password,data.password, (err,same) => {
            if (!same)
                return res.send({ error: 'Erro na autenticação!'});
            data.password = undefined;
            return res.send({ data, token: createUserToken(data.id) });
        });
    }).select('+password');
});

router.get('/', async (req,res) => {
    try {
        const produtos = await produto.find({}); 
        return res.send(produtos);
    }
    catch (err) {
        return res.status(500).send({ error: 'Erro na busca dos produtos!' }); 
    }
});

router.post('/create', async (req,res) => { 
    const { nome,tipo,marca,preco,foto } = req.body;
    if (!nome || !marca || !preco> 0) 
        return res.send({ error: 'Verifique se todos os campos obrigatórios foram informados! '});
        try {
            if (await produto.findOne({ nome,marca,preco }))
                return res.send({ error: 'Produto já cadastrado! '});
            const produtos = await produto.create(req.body);
            return res.status(201).send({produtos});
        }
        catch (err) {
            return res.send({ error: `Erro ao gravar produto: ${err}`})
        }
    });

router.put('/update/:id', auth, async (req,res) => {
    const { nome,tipo,marca,preco,foto } = req.body;
    if (!nome || !marca || !preco) 
        return res.send({ error: 'Verifique se todos os campos obrigatórios foram informados! '});
        try {
            if (await produto.findOne({ marca }))
                return res.send({ error: 'Produto já cadastrado! '});
            const Produtos = await produto.findByIdAndUpdate(req.params.id, req.body); 
            const ProdutosChanged = await produto.findById(req.params.id);
            return res.status(201).send({ ProdutosChanged }); 
        }
        catch (err) {
            return res.send({ error: `Erro ao atualizar o produto: ${err}`})
        }  
});

router.delete('/delete/:id', auth, async (req,res) => {
    try {
        await produto.findByIdAndDelete(req.params.id);
        return res.send({ error: 'Produto removido com sucesso!' });
    }
    catch (err) {
        return res.send({ error: 'Erro ao remover produto!' });
    }     
});

module.exports = router;