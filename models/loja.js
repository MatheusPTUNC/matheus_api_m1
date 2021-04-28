const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const lojaSchema = new Schema({
    nome: { type: String, required: true, unique: false },
    site: { type: String, required: true, unique: true },
    tipo: { type: String, required: false, unique: false },
    cidade: { type: String, required: false, unique: false },
    estado: { type: String, required: false, select: false }, 
    created: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Loja', lojaSchema);

