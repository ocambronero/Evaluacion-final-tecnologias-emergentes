import React from 'react';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';
import BarraNavegacion from './BarraNavegacion.jsx';
import Catalogo from './Catalogo.jsx';

class Tienda extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      catalogo: [],
      productos: [],
      listaCarrito : [],
      loader : true
    }
    this.actualizarDisponible = this.actualizarDisponible.bind(this)
  }
  //==================Component Will Mount========================================
  componentWillMount(){
    var listaProductos = [];
      (
        $.ajax({
  				url:'http://localhost:4000/productos/all', //Consulta a la BD todos los productos disponibles
  	  			method: 'GET'
  			})
  	  		.done(function( snapshot ) {
            snapshot.forEach(function(childSnapshot) {
              var key = childSnapshot._id;
              var childData = childSnapshot;
              listaProductos.push(childData);
            });
          })
        ).then(()=>{ this.setState({
          catalogo : listaProductos,
          productos : listaProductos
        });
      })
  }

  //==============================================================================
  //                    Render
  //------------------------------------------------------------------------------
  render(){
  if(!sessionStorage.getItem('Session')){
    return <Redirect to="/" />
  }

    return(
    <div className="tienda row">
      <div className="container">
        <BarraNavegacion contador={this.contadorCarrito()}/>
        <div className="left lista-productos box">
          <div className="col s12 white darken-1 animated fadeInDown fast">
            <h5 className="col m6 s12 black-text left ">Cátalogo de productos</h5>
            <h5 className="right col m6 s12 input-field">
            <i className="material-icons prefix black-text">search</i>
            <input onChange={this.filtrarCatalogo.bind(this)} type="text" id="descripcion" placeholder="nombre del producto"  type="text" className="black-text no-margin-bottom"/>
            <label htmlFor="descripcion" className="black-text">¿Qué estás buscando?</label>
            </h5>
          </div>
        {
          this.mostrarProductos()
        }
        </div>
      </div>
      </div>
    )
  }
  //==============================================================================
  //                    Funciones
  //------------------------------------------------------------------------------
  mostrarProductos(){
    return this.state.productos.map(
      (producto) => {
        return <Catalogo actualizarDisponible={this.actualizarDisponible} productos={this.state.productos} key={ producto._id } id={producto._id}  nombre={ producto.product_name } imagen={ producto.product_image } disponible={ producto.product_stock } precio ={producto.product_price} /> }
    )
  }
  //============================================================================
  //                    Filtrar Productos
  //----------------------------------------------------------------------------
  filtrarCatalogo(event){
    this.state.productos = this.state.catalogo;             //Inicializar el catálogo de productos con la información de la base de datos
    let palabraFiltro = event.target.value.toLowerCase();   //Pasar la infromación a minúsculas para hacerlas coincidir con el parámetro nombre en la base de datos
    console.log(palabraFiltro)
    let itemMatch = [];                                     //Inicializar el arreglo de productos coincidentes
    for(let item of this.state.productos){                  //Recorrer el arreglo de productos en el Catalogo
      let nombre = item.product_name.toLowerCase();               //crear una variable para comparar los productos
      if(nombre.includes( palabraFiltro )){                 //Verificar que algún item del catálogo contenga los caracteres especificados en el campo de búsqueda
        itemMatch.push(item)}                               //Agregar el producto coincidente al arreglo
      }
      this.setState({productos : itemMatch});              //Actualizar el estado de listado de productos a los productos que tengasn alguna coincidencia con el campo de filtro
      if(itemMatch.length == 0){                           //Si la cantidad de objetos en el estado de la variable producto es 0 devolver un arreglo vacío
        this.state.productos = []
      }
    }
    //=============================================================================
    //             Guardar Items en el carrito
    //--------------Actualizar Disponible------------------------------------------
    actualizarDisponible(item, cantidad){
      for (let productoLista of this.state.productos){ //Recorrer el arreglo de productos obenidos de la base de datos
        if (productoLista._id == item.id){
          //Buscar la coincidencia del producto actual con el de la base de datos
          this.verificarCarrito(item, cantidad)
          productoLista.product_stock = (Number(productoLista.product_stock) - Number(cantidad))  //Actualizar la disponibilidad del producto actual con el resultado de la sustracción de la disponibilidad actual con la cantidad
          this.setState({productos : this.state.productos})                                 //Actualizar el estado de la variable producto con el resultado anterior
          this.setState({listaCarrito : this.state.listaCarrito})                           //Actualizar la variable lista carrito con el nuevo estado de la variable listaCarrito
        }
      }
    }
    //-------------Verificar Carrito------------------------------------------------
    verificarCarrito(item, cantidad){
      if(this.guardarCarrito(item, cantidad) == false){
        this.state.listaCarrito.push(item)  //Si no existe agregarlo al arreglo
      }
      this.setState({listaCarrito : this.state.listaCarrito})    // Actualizar el estado listaCarrito
      sessionStorage.setItem("Carrito", JSON.stringify(this.state.listaCarrito));  //Actualizar la sesion Carrito con los nuevos valores del arreglo en formato string*/
    }
    //------------Agregar a Carrito-------------------------------------------------
    guardarCarrito(item, cantidad){
      if(this.state.listaCarrito.length > 0){
        for(let itemGuardado of this.state.listaCarrito){
          if(itemGuardado.id == item.id){
            itemGuardado.cantidadSolicitada = (Number(itemGuardado.cantidadSolicitada) + Number(cantidad))
            return true //Devolver verdadero si el producto existia en el carrito
          }
        }
        return false; //Devolver falso si el producto no existia en el carrito
      }
      return false; //Devolver falso si el producto no existia en el carrito
    }
    //==============================================================================
    //                    Verificar items en carrito
    itemsCarrito(){
      if(sessionStorage.getItem("Carrito")){
        this.state.listaCarrito = JSON.parse(sessionStorage.getItem("Carrito"));
        return JSON.parse(sessionStorage.getItem("Carrito"));
      }
      return 0;
    }
    //--------------------Contador de items en menu---------------------------------
    contadorCarrito(){
      return this.itemsCarrito().length //Devuelve la cantidad de productos en el carrito
    }
  }
  export default Tienda;
