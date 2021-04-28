const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    nome: { type: String, required: true, unique: false },
    sobrenome: { type: String, required: true, unique: false },
    nascimento: { type: String, required: true, unique: false },
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    dica: { type: String, required: false, unique: false },
    cidade: { type: String, required: false, unique: false },
    estado: { type: String, required: false, unique: false },
    created: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
    let usuario = this;
    if (!usuario.isModified('password'))
        return next();
    usuario.password = await bcrypt.hash(usuario.password, 10);
    return next();
});

module.exports = mongoose.model('User', userSchema);

