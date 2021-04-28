const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/config');

const app = express();

const options = {
    poolSize: 5,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
};

mongoose.connect(config.dbString,options);

mongoose.set('useCreateIndex',true);
mongoose.connection.on('connected', () => {
    console.log('Aplicação conectada ao banco de dados!');
});

mongoose.connection.on('error', (err) => {
    console.log(`Erro na conexão com o banco de dados:  ${err}`);
});

mongoose.connection.on('disconnected', () => {
    console.log('Aplicação desconectada do banco de dados!');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// importando os arquivos de rotas
const usuarioRoutes = require('./routes/usuarios');
const produtoRoutes = require('./routes/produtos');
const lojaRoutes = require('./routes/lojas');

// associando as duas instâncias de rotas ao app
app.use('/usuarios', usuarioRoutes);
app.use('/produtos', produtoRoutes);
app.use('/lojas', lojaRoutes);

app.listen(3000);
module.exports = app;