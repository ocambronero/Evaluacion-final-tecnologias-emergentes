var express = require('express');
var TiendaBD = require('../tiendabd.js'),
	Operaciones = require('./articulosCRUD.js');
var Router = express.Router();

Router.post('/new', (req, res) => {
	console.log('Insertar producto');
	data = {product_name: req.body.product_name, product_price: req.body.product_price, product_image: req.body.product_image, product_stock: req.body.product_stock};
	Operaciones.insertarProducto(data, (error, result) => {
		if(error) res.send(error);
		res.send(result);
	});
});

Router.get('/all', (req, res) => {
	console.log('Consultar productos');
	res.header("Access-Control-Allow-Origin", "*");
	Operaciones.consultarProductos((error, result) => {
		if(error) res.json(error);
		else res.status(200).jsonp(result);
	});
});

Router.get('/id', (req, res) => {
	console.log('Consultar un producto');
	res.header("Access-Control-Allow-Origin", "*");
	Operaciones.consultarProducto(req, (error, result) => {
		if(error) res.json(error);
		else res.status(200).jsonp(result);
	});
});

Router.post('/update', (req, res) => {
	console.log('Actualizar productos');
	res.header("Access-Control-Allow-Origin", "*");
	Operaciones.actualizarProductos(req.body, (error, result) => {
		if(error) res.status(200).jsonp({updateMsg:error});
		else res.status(200).jsonp({updateMsg:"Ok"});
	});
});

module.exports = Router;
