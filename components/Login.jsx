import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import * as request from 'superagent';
import {  BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'

class LoginForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      mensaje: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.checkLogin = this.checkLogin.bind(this);
  }
//================Verificar Sesión==============================================
  checkSession(){
    return sessionStorage.getItem("Session");
  }
//================Obtener Valor del Formulario===============================
//Se utiliza un eventListener para actualizar el valor de la variable email cuando este sea modificado
  handleChange(event) {
    if(event.target.id == "email"){
      this.setState({email: event.target.value});
    }
//Se utiliza un eventListener para actualizar el valor de la variable password cuando este sea modificado
    if(event.target.id == "password"){
        this.setState({password: event.target.value});
    }
  }
//================Verificar Usuario=============================================
  checkLogin(event) {
    event.preventDefault();

//Se da formato al email eliminando el caracter "@" y "." para que coincida con el string en la base de datos
    let email = this.state.email.toLowerCase()
    let emailId = email.replace(/[^a-zA-Z 0-9.]+/g,'').replace(/\./g,'');


    let password = this.state.password; //Almacenar la contraseña en una variable
    let mensajeLogin = '';

//----- consulto usuario y contrasena en MONGODB
$.ajax({
    url:'http://localhost:4000/login',
    method: 'POST',
    dataType: 'json',
    data: {email: this.state.email, password: this.state.password}
})
.done(function( res ) {
    mensajeLogin = res.loginMsg;
      if (mensajeLogin == 'Ok') {
          mensajeLogin = "Iniciando Sesión";
          sessionStorage.setItem("Session", email);
      }else {
        alert('Alerta: '+mensajeLogin);
      }
    });

//------ FIN DE LA CONSULTA DE USUARIO
    this.setState({mensaje : mensajeLogin}); //Asignar el valor del mensaje y mostrarlo en pantalla
  }

//============Acciones Renderizado==============================================
    render(){

    if (this.checkSession()){
      return <Redirect to='/tienda'/>
    }
      return(
        <div className="login row">
          <div className="col s6 form-container animated fadeIn slow">
            <form onSubmit={this.checkLogin}>
              <h4 className="text-center white-text">Inicia Sesión</h4>
              <div className="col s12 input-field">
                <input type="email" ref="email" id="email" value={this.state.email} onChange={this.handleChange} placeholder="Correo Electrónico" className="validate white-text" required aria-required="true" />
                <label htmlFor="email" data-error="Error en formato de email. Ejemplo: ocambronero@gmail.com" data-success="Formato de email correcto">Correo Electrónico</label>
              </div>
              <div className="col s12 input-field">
                <input type="password" ref="password" id="password" value={this.state.password} onChange={this.handleChange} placeholder="Contraseña" className="validate  white-text" required aria-required="true" />
                <label htmlFor="password" data-error="Contraseña no puede ser vacía" className="white-text">Contraseña</label>
              </div>
              <div className="col s12 center-align">
                <div className="mensaje">
                {this.state.mensaje}
                </div>
                <button type="submit" className="btn btn-success" >Ingresar</button>
              </div>
            </form>
          </div>
        </div>
     );
    }
}
export default LoginForm;
