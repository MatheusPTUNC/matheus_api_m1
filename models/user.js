// importando/instanciando a biblioteca 'mongoose'
const mongoose = require('mongoose');
// instanciando o 'schema' do mongoose para a criação dos models
const Schema = mongoose.Schema;

// criação do 'schema' para o usuário
const userSchema = new Schema({
    name: { type: String, required: true, unique: false },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

