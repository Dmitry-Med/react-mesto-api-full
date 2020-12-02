import React, { useState } from 'react';


const Login = ({onLogin}) => {
    const [data, setData] = useState({
      email: '',
      password: '',
    });    
   
    const handleChange = (e) => {
      const {name, value} = e.target;
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }     

    const handleSubmit = (e) => {
      e.preventDefault();
      onLogin(data);
    }
  
    return(
      <section
    className="popup popup_theme_sign">
    <div className="popup__container popup__container_theme_sign"> 
    <h2 className="popup__title  popup__title_type_sign">Вход</h2>
    <form
      name="loginform"
      className="popup__form popup__form_login"
      onSubmit={handleSubmit}
      noValidate
    >
    <div className="popup__input-field">
      <input
        type="email"
        id="loginemail"
        name="email"
        className=" popup__input popup__input_type_sign"
        placeholder="Email"
        value={data.email || ''}
        onChange={handleChange}
        required
      />
      <span className="popup__error" id="loginemail-error"></span>
      </div>
    <div className="popup__input-field">
      <input
        type="password"
        id="loginpassword"
        name="password"
        placeholder="Пароль"              
        className=" popup__input popup__input_type_sign" 
        value={data.password || ''}             
        onChange={handleChange}
        required
        minLength="4"
        maxLength="12"
      />
      <span className="popup__error" id="loginpassword-error"></span>
    </div>          
    <button className="popup__button popup__button_theme_sign" type="submit">Войти
    </button>
    </form>     
   </div>
  </section>
    )
  }
  
  export default Login;
  
