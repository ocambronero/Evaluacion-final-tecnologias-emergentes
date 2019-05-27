import React from 'react';
import $ from 'jquery';
import { BrowserRouter as Router, Route, Link, IndexRoute } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import Tienda from './Tienda.jsx';
import BarraNavegacion from './BarraNavegacion.jsx';
import Carrito from './Carrito.jsx';

class Producto extends React.Component{
  constructor(props){
    super(props)
    this.state = {
        producto : [],
        listaProductos : [],
        idProducto : [],
        atras : 0,
        siguiente : 0,
        refresh: false
      }
    }
    //==============================================================================
    //                    Component Will Mount
    //------------------------------------------------------------------------------
    componentWillMount(){
    const { idProducto } = this.props.match.params;
      const listaProductos = []
      var producto = []
      console.log('idProducto: '+idProducto);
        if(this.state.producto == ""){                                                   //Verificar si se ha cargado previamente la información del catálogo
//
          (
            $.ajax({
      				url:'http://localhost:4000/productos/all',
      	  			method: 'GET'
      			})
      	  		.done(function( snapshot ) {
                snapshot.forEach(function(childSnapshot) {
                  var key = childSnapshot._id;
                  var childData = childSnapshot;
                  if(childData._id == idProducto){
                    producto.push(childData);
                    console.log('encontré el producto');
                  }
                  listaProductos.push(childData)
                });
              })
            ).then(()=>{ this.setState({
              listaProductos : listaProductos,
              producto : producto
            });
          })
//
      }
      this.navegacion(idProducto);
    }
    //==============================================================================
    //                    Render
    //------------------------------------------------------------------------------
    render() {
      console.log('Detalle producto');
      console.log(this.state.producto);
        return(
        <div className="tienda row">
          <div className="container">
            <BarraNavegacion contador={this.contadorCarrito()}/>
            <div className="col s12 box carrito blue darken-1">
              <h5 className="left">
                <Link to='/tienda' className='white-text'>Tienda</Link><span className="white-text "> > {this.state.producto.map((producto)=>producto.product_name)} </span>
              </h5>
            </div>
            <div className="col s12 box carrito white">
              {
                this.mostrarProducto()
              }
            </div>
          </div>
        </div>
       );
    }

    mostrarProducto(){
      return this.state.producto.map(
        (producto) => { return (<DetalleProducto
                                siguiente={this.state.siguiente}
                                atras={this.state.atras}
                                navegacion={this.navegacion.bind(this)}
                                listaProductos={this.state.listaProductos}
                                actualizarDisponible={this.actualizarDisponible.bind(this)}
                                key={ producto.id }
                                producto={producto} />
                              )}
      )
    }


    //==============================================================================
    //                    Verificar items en carrito
    //------------------------------------------------------------------------------
    itemsCarrito(){
      if(sessionStorage.getItem("Carrito")){                                    //Verificar si la sesión del carrito contiene información
        this.state.listaCarrito = JSON.parse(sessionStorage.getItem("Carrito")); //Actualizar la información del carrito con la sesión actual en formato JSON
        return JSON.parse(sessionStorage.getItem("Carrito"));                    //Devolver los items del carrito en formato JSON
      }
      return 0;                                                                  //Devolver 0 si no existen carritos
    }
    //--------------------Contador de items en menu---------------------------------
    contadorCarrito(){
      return this.itemsCarrito().length //Contar la cantidad de items en el carrito
    }
    //=============================================================================
    //             Guardar Items en el carrito
    //--------------Actualizar Disponible------------------------------------------
    actualizarDisponible(item, cantidad){
      for (let productoLista of this.state.producto){
        if (productoLista.id == item.id){
          this.verificarCarrito(item, cantidad)
          productoLista.disponible = (Number(productoLista.disponible) - Number(cantidad))
          this.setState({producto : this.state.producto})
          this.setState({listaCarrito : this.state.listaCarrito})
        }
      }
    }

    //-------------Verificar Carrito------------------------------------------------
    verificarCarrito(item, cantidad){
      if(this.guardarCarrito(item, cantidad) == false){                                //Verificar que el item enviado como parámetro no exista previamente en el arreglo de objetos de productos
        this.state.listaCarrito.push(item)                                             //Si no existe agregarlo al arreglo
      }
      this.setState({listaCarrito : this.state.listaCarrito})                          // Actualizar el estado listaCarrito
      sessionStorage.setItem("Carrito", JSON.stringify(this.state.listaCarrito));      //Actualizar la sesion Carrito con los nuevos valores del arreglo en formato string*/
    }
    //------------Agregar a Carrito-------------------------------------------------
    guardarCarrito(item, cantidad){
      if(this.state.listaCarrito.length > 0){                                                     //Verificar que el carrito contenga informacion
        for(let itemGuardado of this.state.listaCarrito){                                        //Recorrer el arreglo de productos actuales en el carrito
          if(itemGuardado.id == item.id){                                                       //Verificar que el producto en el carrito coincida con el id del producto enviado como parámetro
            itemGuardado.cantidad = (Number(itemGuardado.cantidad) + Number(cantidad))
            return true //Devolver verdadero si el producto existia en el carrito
          }
        }
        return false; //Devolver falso si el producto no existia en el carrito
      }
      return false; //Devolver falso si el producto no existia en el carrito
    }

    navegacion(id:number){ //Navegar entre productos en vista detalle recibiendo como parámetro el id del URL actual
      let back = Number(id-1); //Restarle una unidad al valor del id actual
      if(back >= 0){ //Verificar que el valor sea mayor o igual a cero
        this.setState({atras : back }) ; //Devolver el resultado como parámetro
      }

      let next = Number(id+1);
      if(id < this.state.listaProductos.length){ //Verificar que el id actual sea menor que la cantidad de productos en el catálogo
        this.setState({siguiente : next}); //Devolver el resultado como parámetro
      }
    }

 }
export default Producto;

//=================== DETALLE DEL PRODUCTO =====================================
class DetalleProducto extends React.Component{

//==============================================================================
//                    Constructor
//------------------------------------------------------------------------------
constructor(props) {
  super(props);
  this.state = { //Inicializar variables
      inputValue : 1,
      disponible : this.props.producto.product_stock,
      contadorCarrito : 0,
      listaProductos: this.props.listaProductos,
      listaCarrito: JSON.parse(sessionStorage.getItem('Carrito')) ? JSON.parse(sessionStorage.getItem('Carrito')) : [] ,
      producto : this.props.producto,
      productoCarrito : {
        id : '',
        descripcion : '',
        imagen : '',
        cantidad : '',
      },
      };
}
//==============================================================================
//                    Component Will Mount
//------------------------------------------------------------------------------
componentWillMount(){
      this.checkCarrito(this.props.producto);
      this.props.navegacion(this.props.producto.id);
}
//==============================================================================
//                    Render
//------------------------------------------------------------------------------
  render(){
  if(!sessionStorage.getItem('Session')){                                       //Verificar que exista sesion iniciada
    return <Redirect to="/" />
  }
    const producto = this.props.producto
    return (
      <div className="row left">
        <h4 className="card-title">{producto.product_name}</h4>
        <div className="card">
          <div className="card-image col s12 m6 l6 left">
            <div className={this.state.product_stock ? 'card-image' : 'card-image'}>
              <img src={'../../assets/img/'+producto.product_image}/>
            </div>
          </div>
          <div className="col s12 m6 l6">
            <div className="card">
              <div className="card-content">
                <div className="informacion blue-grey-text text-darken-2">
                  <span hidden={this.state.contadorCarrito ? false : true}className="badge carrito"><Link to="/carrito"><small className="white-text text-shadow"><i className="material-icons left">shopping_cart</i> <p className="left  ">{this.state.contadorCarrito}</p></small></Link></span>
                  <p><b>Precio: </b>{producto.product_price}</p>
                  <p><b>Unidades disponibles: </b>{this.state.disponible ? this.state.disponible : 'Producto agotado'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-action">
          <button><Link to='/tienda' >Atrás</Link></button>
        </div>
      </div>
    )
  }

  //==============================================================================
  //                    Funciones
  //------------------------------------------------------------------------------
  //--------------------Agregar Productos-----------------------------------------
    agregarProducto(){
       let cantidad = this.state.inputValue;
       const producto = this.props.producto;
       if (cantidad <=0) {
        alert('Seleccione una cantidad válida');
        return
       }
       if(this.state.disponible < cantidad){
         alert('Máxima existencia es: '+ this.state.disponible);    //Mostrar un mensaje de alerta con la cantidad maxima disponible
       }else{
         let disponibles = (Number(this.state.disponible) - Number(cantidad));
         let agregarACarrito = (Number(this.state.contadorCarrito) + Number(cantidad));
         this.setState({disponible : disponibles});
         this.setState({contadorCarrito : agregarACarrito});
         this.state.productoCarrito.id =  producto._id;
         this.state.productoCarrito.descripcion =  producto.product_name;
         this.state.productoCarrito.imagen =  producto.product_image;
         this.state.productoCarrito.precio =  producto.product_price;
         this.state.productoCarrito.cantidad = (Number(this.state.productoCarrito.cantidad) +  Number(cantidad));
         this.props.actualizarDisponible(this.state.productoCarrito, cantidad, false);
       }
    }
  //------------------------------------------------------------------------------
  //======================EventListener para campo de cantidades====================
    updateInputValue(evt) {
      this.setState({
        inputValue: evt.target.value
      });
    }
  //---------------------Verificar carrito----------------------------------------
    checkCarrito(producto){
      console.log('checkCarrito')
      for(let itemCarrito of this.state.listaCarrito){ //Recorrer el arreglo de productos almacenados en el carrito
        if(itemCarrito.id == producto._id){
          let actualizarDisponible = (Number(this.state.disponible) - Number(itemCarrito.cantidad));
          console.log('itemCarrito: '+itemCarrito.cantidad)
          console.log('actualizarDisponible: '+actualizarDisponible)
          this.setState({disponible : actualizarDisponible, contadorCarrito : itemCarrito.cantidad});
        }
      }
    }
  //------------------------------------------------------------------------------
}
