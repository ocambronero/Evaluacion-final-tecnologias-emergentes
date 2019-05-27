
var Producto = require('./articuloModel.js');

module.exports.insertarProducto = function (data, callback) {
	let newProducto = new Producto(data);

	newProducto.save((error) => {
		if(error) callback(error);
		callback(null,"Producto nuevo guardado");
	});
};

module.exports.consultarProductos = function (callback) {
	Producto.find((err, articulos) => {
		if(err)
			callback(err);
		else {
			console.log('Se consultan todos los productos ');
      		callback(null,articulos);
      	}
	});
};

module.exports.consultarProducto = function (id, callback) {
	Producto.findOne({_id: id}, (err, producto) => {
		if(err)
			callback(err);
		else {
			console.log('Articulo: '+producto);
      		callback(null,producto);
      	}
	});
};

module.exports.actualizarProductos = function (data, callback) {
	let err = "";
	console.log('Datos a actualizar')
	console.log('id: '+data.id)
	console.log('nuevo stock: '+data.product_stock)
	Producto.update({_id: data.id}, {product_stock: data.product_stock}, (error, result) => {
		if(error) err = " "+data.product_name+",";
	});
	if (err != "") callback("Problemas al actualizar:"+err);
	else callback(null,"Producto actualizado correctamente");
};

module.exports.eliminarProducto = function (id, callback) {
	Producto.remove({_id: id}, (error) => {
		if(error) callback(error);
		callback(null,"Registro del artículo eliminado");
	});
};

module.exports.eliminarAllProductos = function (callback) {
	Producto.remove({}, (error) => {
		if(error) callback(error);
		callback(null,"Todos los articulos eliminados");
	});
};
