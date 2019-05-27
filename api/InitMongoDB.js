var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')

var opts = {
  keepAlive: 1,
  useNewUrlParser: true
}
mongoose.connect('mongodb://localhost:27017/TiendaBD', opts)
console.log('Conectado a MONGODB')

var usuario = new mongoose.Schema({}, { strict: false })
var Usuario = mongoose.model('usuarios', usuario)

const newUsuario = new Usuario({
  name: "Usuario de prueba",
  email: "test@gmail.com",
  password: bcrypt.hashSync('1234', 10)
})

//Se crea el usuario test
newUsuario.save()
console.log('Usuario test@gmail.com creado')

const newUsuario2 = new Usuario({
  name: "Oscar Cambronero",
  email: "ocambronero@gmail.com",
  password: bcrypt.hashSync('1234', 10)
})

newUsuario2.save()
console.log('Usuario ocambronero@gmail.com creado')

  var OpProductos = require('./articulos/articulosCRUD.js');

  var productos = [
    {product_name: "Aguacate", product_image: "aguacate.jpg", product_price: "5.00", product_stock: "46"},
    {product_name: "Ajo", product_image: "ajo.jpg", product_price: "2.00", product_stock: "75"},
    {product_name: "Almendras", product_image: "almendras.jpg", product_price: "6.00", product_stock: "28"},
    {product_name: "Arándanos", product_image: "arandanos.jpg", product_price: "6.00", product_stock: "39"},
    {product_name: "Brócoli", product_image: "brocoli.png", product_price: "3.00", product_stock: "45"},
    {product_name: "Calabaza", product_image: "calabaza.jpg", product_price: "6.00", product_stock: "40"},
    {product_name: "Canela", product_image: "canela.jpg", product_price: "2.00", product_stock: "20"},
    {product_name: "Cebolla", product_image: "cebolla.jpg", product_price: "4.00", product_stock: "30"},
    {product_name: "Fresa", product_image: "fresa.jpg", product_price: "2.00", product_stock: "50"},
    {product_name: "Kiwi", product_image: "kiwi.jpg", product_price: "3.00", product_stock: "36"},
    {product_name: "Limón", product_image: "limon.jpg", product_price: "1.50", product_stock: "70"},
    {product_name: "Lychee", product_image: "lychee.jpg", product_price: "5.00", product_stock: "80"},
    {product_name: "Maiz", product_image: "maiz.jpg", product_price: "2.50", product_stock: "40"},
    {product_name: "Manzana", product_image: "manzana.jpg", product_price: "3.40", product_stock: "39"},
    {product_name: "Naranja", product_image: "naranja.jpg", product_price: "3.00", product_stock: "60"},
    {product_name: "Papa", product_image: "papa.jpg", product_price: "3.50", product_stock: "60"},
    {product_name: "Pasta", product_image: "pasta.jpg", product_price: "2.50", product_stock: "47"},
    {product_name: "Pimienta", product_image: "pimienta.jpg", product_price: "3.80", product_stock: "70"},
    {product_name: "Repollo", product_image: "repollo.jpg", product_price: "4.50", product_stock: "67"},
    {product_name: "Tomate", product_image: "tomate.jpg", product_price: "2.80", product_stock: "78"},
    {product_name: "Zanahoria", product_image: "zanahoria.jpg", product_price: "1.80", product_stock: "58"}
  ]

  for (var i = 0; i < productos.length ; i++) {
    var producto = productos[i];
    OpProductos.insertarProducto(producto, (error, result) => {
      if(error) console.log(error);
      console.log(result);
    });
  }
