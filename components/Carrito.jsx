import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import * as request from 'superagent';
import $ from 'jquery';
import { FormattedMessage } from 'react-intl';
import BarraNavegacion from './BarraNavegacion.jsx';
import CarritoDetalle from './CarritoDetalle.jsx'

class Carrito extends React.Component{
  //===============================================================================
  //                    Constructor
  //------------------------------------------------------------------------------
  constructor(props) {
    super(props)
    this.state = {
      listaCarrito : [],
      inputValue:0,
      redirect : false,
      counter : 1,
      pagar : false
    }
    this.vaciarCarrito = this.vaciarCarrito.bind(this)
  }
  //==============================================================================
  //                    Component Will Mount
  //------------------------------------------------------------------------------
  componentWillMount(){
    this.setState({listaCarrito : JSON.parse(sessionStorage.getItem('Carrito')) ? JSON.parse(sessionStorage.getItem('Carrito')) : '[]' })
  }
  //============================================================================
  //                    Render
  //----------------------------------------------------------------------------
  render(){
    console.log('Estoy en Carrito.jsx')
    if(!sessionStorage.getItem('Session')){     //Verificar si existe sesión iniciada
      return <Redirect to="/" />
    }
    if(this.contadorCarrito()){
      return(
        <div className="tienda row">
          <div className="container">
            <BarraNavegacion contador={this.contadorCarrito()}/>
            <div className="animated fadeIn slow">
              <div className="box carrito">
                <div className="row col s12 blue darken-1 animated fadeInDown fast">
                  <h5 className="col m6 s12 white-text left ">Carrito de compras</h5>
                </div>
                <div className="col l8 m6 s12">
                  {
                    this.mostrarCarrito()
                  }
                </div>
                <div className="col l4 m6 s12">
                  <h5 className="right col s12 right-align"><button className="btn red darken-4 btn-sm"  type="button" onClick={this.vaciarCarrito}><i className="material-icons" style={{'lineHeight' : '14px', 'fontSize': '17px', 'position' : 'relative', 'top': '3px'}} >delete</i> Vaciar Carrito</button></h5>
                  <h5 className="right col s12 right-align"> Total a pagar:</h5>
                  <h5 className="right col s12 right-align animated pulse fast"> <FormattedMessage   id="total"  defaultMessage={`$ {total, number}`} values={{total : this.total()}}  /></h5>
                  <p className="right">
                    <button onClick={this.pagarCarrito.bind(this)} className="btn green darken-1" type="button"  ><i className="material-icons">credit_card</i> Pagar</button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }else if(!this.contadorCarrito() && this.state.redirect == false){
      console.log('redirect: '+this.state.redirect)
      return (
        <div className="tienda row">
          <div className="container">
            <BarraNavegacion contador={this.contadorCarrito()}/>
            <div className="animated fadeIn slow">
              <div className="box white col s12 center-align" style={{padding: '5%'}}>
                <h5  style={{height : '70vh', display : 'table-cell', verticalAlign : 'middle'}} >No hay productos en el carrito de compras.
                <Link to="/tienda">La Bodega</Link></h5>
              </div>
            </div>
          </div>
        </div>
      )
    }else{
      return <Redirect to="/tienda"/>; //Redireccionar a la tienda
    }
  }
  //==============================================================================
  //                    Funciones
  //----------------------Mostrar items en carrito=-------------------------------
  mostrarCarrito(){
    console.log('mostrarCarrito')
    return this.state.listaCarrito.map(
      (producto) => {
        return <CarritoDetalle key={ producto.id } id={producto.id}  imagen={ producto.imagen } nombre={ producto.nombre } cantidad={ producto.cantidadSolicitada } precio ={producto.precio} actualizarDisponible={this.actualizarDisponible.bind(this)}/> }
    )
  }
  //==============================================================================
  //                    Verificar items en carrito
  itemsCarrito(){
    if(sessionStorage.getItem("Carrito")){                                    //Verificar si la sesión del carrito contiene información
      this.state.listaCarrito = JSON.parse(sessionStorage.getItem("Carrito")); //Actualizar la información del carrito con la sesión actual en formato JSON
      return JSON.parse(sessionStorage.getItem("Carrito"));                    //Devolver los items del carrito en formato JSON
    }
    return 0;                                                                  //Devolver 0 si no existen carritos
  }
  //--------------------Contador de items en menu---------------------------------
  contadorCarrito(){
    console.log('contadorCarrito: '+this.itemsCarrito().length)
    if (this.itemsCarrito().length == 0)
      return false
    else
      return true //this.itemsCarrito().length //Contar la cantidad de items en el carrito
  }
  //=============================================================================
  //             Guardar Items en el carrito
  //--------------Actualizar Disponible------------------------------------------
  actualizarDisponible(item:Object, cantidad:Number, remover:Boolean = false){
    for (let productoLista of this.state.listaCarrito){
      if (productoLista.id == item.id){
        productoLista.cantidad = cantidad
        if(productoLista.cantidad == 0 || remover == true){
          this.removerItem(item)
        }
      }
    }
    sessionStorage.setItem("Carrito", JSON.stringify(this.state.listaCarrito))
    this.setState({listaCarrito : this.state.listaCarrito})
  }
  //---------------Remover item del carrito--------------------------------------
  removerItem(item){
    let index = this.state.listaCarrito.findIndex(producto => producto.id === item.id)
    let newArray =   this.state.listaCarrito.splice(index, 1)
  }
  //-----------------Vaciar los items del carrito------------------------------------
  vaciarCarrito(){
    this.setState({listaCarrito : []})
    sessionStorage.setItem('Carrito', '[]') //Asignar como parámetro un array vacío en formato string a la sesion Carrito
  }
  //==============Calcular Totales================================================
  total(){
    let total :number = 0 //Inicializar los totales
    let items = this.state.listaCarrito; //Iniciar la variable items con los items actuales en el carrito
    for(let subtotal of items ){ //recorrer los items dentro del carrito
      total += subtotal.cantidadSolicitada * subtotal.precio; //Realizar el producto entre la cantidad y el precio y agregarlo al valor guardado anteriormente
    }
    return total; //Devolver el valor de la suma total de todos lso subtotales del producto
  }
  //=============Pagar Carrito==================================================
  pagarCarrito(){
    const listaCarrito = this.state.listaCarrito                                   //Definir la constante lista carrito
    this.setState({ pagar : true})
//Inicia proceso de actualización en la BD
  for (let item of listaCarrito){
    var nuevoStock = item.disponible - item.cantidadSolicitada
    $.ajax({
      url:'http://localhost:4000/productos/update',
        method: 'POST',
        data: {id: item.id, product_stock: nuevoStock}
    })
    .done(function( res ) {
      if (res.updateMsg == 'Ok'){
        console.log('Se actualizó el producto comprado')
      }else{
        console.log('Se presentaron problemas con la actualización')
      }
    })
  }
  //Una vez actualizados los articulos, se deben reiniciar el carritos
  this.vaciarCarrito()                                                               //Vaciar carrito
  this.setState({ counter : 0})                                                //Actualizar el estado de la variable contador por el contador actual
  this.setState({ redirect : true })                                                 //Cambiar el estado de redireccion a true

}

  componentDidUpdate(){
    console.log('Actualización de disponibilidad correcta.');                               //Mostrar mensaje en consola cada vez que el producto sea actualizado en la base de datos
  }
}

export default Carrito;
