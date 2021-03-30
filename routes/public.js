// importando a biblioteca 'express'
const express = require('express');
// importando as funcionalidades do 'express' para trabalho com rotas
const router = express.Router();

// criando os 'endpoints' para as rotas
// raiz
router.get('/', (req,res) => {
    return res.send({ message: 'Tudo OK com o método GET da raiz!' });
})

router.post('/', (req,res) => {
    return res.send({ message: 'Tudo OK com o método POST da raiz!' });
});


// exportando o módulo
module.exports = router;