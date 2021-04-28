const express = require('express');
const router = express.Router();
const Users = require('../models/usuario');
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


router.get('/', auth, async (req,res) => {
    try {
        const users = await Users.find({}); 
        return res.send(users);
    }
    catch (err) {
        return res.status(500).send({ error: 'Erro na busca dos usuários!' }); 
    }
});


router.post('/create', auth, async (req,res) => { 
    const { nome,sobrenome,nascimento,login,password,dica,cidade,estado } = req.body;
    if (!nome || !sobrenome || !nascimento || !login || !password) 
        return res.send({ error: 'Verifique se todos os campos obrigatórios foram informados! '});
    try {
        if (await Users.findOne({ login }))
            return res.send({ error: 'Usuário já cadastrado! '});
        const user = await Users.create(req.body);
        user.password = undefined;
        return res.status(201).send({ user, token: createUserToken(user.id) });
    }
    catch (err) {
        return res.send({ error: `Erro ao gravar o usuário: ${err}`})
    }
});


router.put('/update/:id', auth, async (req,res) => {
    const { nome,sobrenome,nascimento,login,password,dica,cidade,estado } = req.body;
    if (!nome || !sobrenome || !nascimento || !login || !password) 
        return res.send({ error: 'Verifique se todos os campos obrigatórios foram informados! '});
    try {
        if (await Users.findOne({ login }))
            return res.send({ error: 'Usuário já cadastrado! '});
        const user = await Users.findByIdAndUpdate(req.params.id, req.body); 
        const userChanged = await Users.findById(req.params.id);
        userChanged.password = undefined;
        return res.status(201).send({ userChanged }); 
    }
    catch (err) {
        return res.send({ error: `Erro ao atualizar o usuário: ${err}`})
    }     
});

router.delete('/delete/:id', auth, async (req,res) => {
    try {
        await Users.findByIdAndDelete(req.params.id);
        return res.send({ error: 'Usuário removido com sucesso!' });
    }
    catch (err) {
        return res.send({ error: 'Erro ao remover usuário!' });
    }     
});

module.exports = router;