const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const produtoSchema = new Schema({
    nome: { type: String, required: true, unique: false },
    tipo: { type: String, required: false, unique: false },
    marca: { type: String, required: true, unique: false },
    preco: { type: Number, required: true, unique: false },
    foto: { type: String, required: false, select: false }, 
    created: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Produto', produtoSchema);

