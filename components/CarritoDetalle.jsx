import React from 'react'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl';

class CarritoDetalle extends React.Component {

  //===============================================================================
  //                    Constructor
  //------------------------------------------------------------------------------
  constructor(props) {
    super(props);
    this.state = { //Inicializar variables
      inputValue : 0,
      subtotal: 0,
      listaProductos: [],
      productoCarrito : {
        id : '',
        descripcion : '',
        imagen : '',
        cantidadSolicitada : '',
      },
    };
  }
//==============================================================================
//                    Component Will Mount
//------------------------------------------------------------------------------
//Se ejecuta la función subtotal enviando como parámetros el precio del producto y la cantidad solicitada
//Se actualiza el estado de la variable listaProductos con el valor de la sesion del carrito
  componentWillMount(){
    this.subtotal(this.props.precio, this.props.cantidad)
    this.setState({listaProductos : JSON.parse(sessionStorage.getItem('Carrito'))})
  }
//==============================================================================
//                    Render
//------------------------------------------------------------------------------
  render() {
    return (
      <div className="col s12 animated fadeIn fast">
        <div className="card horizontal">
          <div className="card-image">
            <Link to={`/producto/${this.props.id}`}>
              <img src={'../../assets/img/'+this.props.imagen}/>
            </Link>
          </div>
          <div className="card-stacked">
            <button onClick={() => this.eliminarProducto(true)} className="btn-floating halfway-fab waves-effect waves-light red"><i className="material-icons">delete</i></button>
            <div className="card-content">
              <div className="informacion blue-grey-text text-darken-2">
                <p className="card-title">{this.props.nombre}</p>
                <p><b>Precio: </b><FormattedMessage   id="precio"  defaultMessage={`$ {precio, number}`} values={{precio : this.props.precio}}  /></p>
                <p><b>Cantidad solicitada: </b>{this.props.cantidad ? this.props.cantidad : 'Producto agotado'}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="card-action z-depth-2">
          <div className="no-padding col s12 right-align">
            <h5 className="animated pulse fast" ><b>Subtotal: </b> <FormattedMessage   id="subtotal"  defaultMessage={`$ {subtotal, number}`} values={{subtotal : this.state.subtotal}}  /></h5>
          </div>
        </div>
      </div>

    )
  }
//======================EventListener para campo de busqueda====================
  updateInputValue(evt) {
    this.setState({
      inputValue: evt.target.value
    });
  }
//======================Método subtotal ========================================
//Se crea una variable con el producto de la cantidad y el precio enviados como parámetros
//Se devuelve el valor del arreglo
  subtotal(precio, cantidad){
    let subtotal = Number(cantidad) * Number(precio);
    this.setState({subtotal : subtotal})
  }
//============================ Métrodo eliminarProducto ========================
//Función para actualizar la eliminarProducto del carrito
//Guardar la cantidad obtenida entre la cantidad en el carrito y el valor del campo de texto
//Asignar los valores correspondientes a los campos en el estado actual de la variable roductoCarrito
  eliminarProducto(remover:Boolean = false){
    let cantidad = (Number(this.props.cantidad) - Number(this.state.inputValue))
    this.state.productoCarrito.id =  this.props.id;
    this.state.productoCarrito.descripcion =  this.props.descripcion;
    this.state.productoCarrito.imagen =  this.props.imagen;
    this.state.productoCarrito.precio =  this.props.precio;
    this.state.productoCarrito.cantidad = this.props.cantidad;

//Ejecutar la función actualizarDisponible enviando como parámetro el producto actial junto a la cantidad al valor de la variable remover
//Se ejecutar la funcion subtotal para actualizar los subtotales de acuerdo a la nueva cantidad
//Se actualizar el estado de la variable productoCarrito con el calor de la sesión Carrito
    this.props.actualizarDisponible(this.state.productoCarrito, cantidad, remover)
    this.subtotal(this.props.precio, cantidad)
    this.setState({productoCarrito : JSON.parse(sessionStorage.getItem("Carrito"))})
  }
}

export default CarritoDetalle
