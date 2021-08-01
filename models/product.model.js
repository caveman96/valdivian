const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    productid: {type: String, required: true, unique: true, minlength: 4},
    price: {type: Schema.Types.Decimal128, required: true},
    stock: {type: Number}
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
