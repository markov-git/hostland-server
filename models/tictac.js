const {Schema, model} = require('mongoose')

const tictac = new Schema({
    total: {type: Number, required: true},
    wins: {type: Number, required: true},
    ties: {type: Number, required: true}
})

module.exports = model('Tictac', tictac)