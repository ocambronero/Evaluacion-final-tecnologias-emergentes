
var mongoose = require('mongoose');

var productoSchema = new mongoose.Schema({
	product_name: {type: String, required: true},
	product_image: {type: String, required: true},
	product_price: {type: String, required: true},
	product_stock: String,
});
var Articulo = mongoose.model('articulos', productoSchema);
module.exports = Articulo;
