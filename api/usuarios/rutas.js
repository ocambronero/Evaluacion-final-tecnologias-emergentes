
var express = require('express');
var TiendaBD = require('../tiendabd.js'),
	Operaciones = require('./usuariosCRUD.js');
var Router = express.Router();

Router.post('/', (req, res, next) => {
	console.log('Consultar un usuario');
	console.log('req '+req.body.email);
	console.log('req '+req.body.password);
	Operaciones.consultarUsuario({email: req.body.email, password: req.body.password},(error, result) => {
		if(error) res.status(200).jsonp({loginMsg:error});
		else {
			req.session.login = true;
			req.session.userLogin = result;
			res.status(200).jsonp({loginMsg:error});
		}
	});
});

module.exports = Router;
