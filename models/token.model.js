const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    expiry : { type: Number, required: true},
    token : {type: String, required: true, unique: true, trim: true},
}, {
    timestamps: true,
});

const Token = mongoose.model('Token', tokenSchema);
module.exports = Token;
