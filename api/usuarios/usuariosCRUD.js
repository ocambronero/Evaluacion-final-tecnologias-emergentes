
var bcrypt = require('bcryptjs')
var Usuario = require('./usuarioModel.js');

module.exports.insertarUsuario = function (callback) {
	let User1 = new Usuario({nombre: "Oscar Cambronero", email: 'ocambronero@gmail.com', password:bcrypt.hashSync('1234', 10)});

	User1.save((error) => {
		console.log('Guardar un usuario');
		if(error) callback(error);
		callback(null,"Usuario nuevo guardado");
	});
};

module.exports.eliminarUsuario = function (callback) {
	Usuario.remove({email: 'ocambronero@gmail.com'}, (error) => {
		if(error) callback(error);
		callback(null,"Registro del usuario eliminado");
	});
};

module.exports.consultarUsuario = function (data, callback) {
	console.log('Consultar usuario en usuariosCRUD');
	console.log('Data: '+data.email);
	Usuario.findOne({email: data.email}, (err, user) => {
		if(user){
			bcrypt.compare(data.password, user.password, function(err, res) {
			if(res)
				callback('Ok');
  		else
  			callback('Contraseña incorrecta');
			});
	} else
			callback('Usuario no existe');
	});
};
