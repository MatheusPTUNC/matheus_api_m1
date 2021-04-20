// importando a biblioteca 'jsonwebtoken'
const jwt = require('jsonwebtoken');
// importando a biblioteca para configurações
const config = require('../config/config');

// criando o middleware para a autenticação
const auth = (req, res, next) => {
    // recebendo o token
    const tokenHeader = req.headers.auth;
    // testando se não está sendo recebido um token
    if (!tokenHeader)
        return res.send({ error: 'Token não recebido!' });
    // se o token foi recebido
    jwt.verify(
        tokenHeader,
        config.jwtPass,
        (err, decoded) => {
            // se ocorrer erro na verificação do token
            if (err)
                return res.send({ error: 'Token inválido!' });
            // caso o token seja válido
            res.locals.authData = decoded;
            return next();
        } 
    );
};

// exportando o módulo
module.exports = auth;