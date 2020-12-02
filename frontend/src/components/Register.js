import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const Register = ({onRegister}) => {   
  const [data, setData] = useState( {      
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
    onRegister(data);
    }

    return(
   <section
    className="popup popup_theme_sign">
    <div className="popup__container popup__container_theme_sign"> 
      <h2 className="popup__title  popup__title_type_sign">Регистрация</h2>
    <form
      name="registerform"
      className="popup__form popup__form_register"
      onSubmit={handleSubmit}
      noValidate
    >
    <div className="popup__input-field">
      <input
        type="email"
        id="email"
        name="email"
        className=" popup__input popup__input_type_sign"
        placeholder="Email"
        value={data.email || ''}
        onChange={handleChange}
        required
      />
      <span className="popup__error" id="email-error"></span>
      </div>
    <div className="popup__input-field">
      <input
        type="password"
        id="password"
        name="password"
        placeholder="Пароль"              
        className=" popup__input popup__input_type_sign" 
        value={data.password || ''}             
        onChange={handleChange}
        required
        minLength="4"
        maxLength="12"
      />
      <span className="popup__error" id="password-error"></span>
    </div>          
    <button className="popup__button popup__button_theme_sign" type="submit">Зарегистрироваться
    </button>
    </form>
    <p className="popup__footnote">Уже зарегистрированы?
    <Link to="/signin" className="popup__link">Войти</Link>
    </p>  
  </div>
</section>
    )
  }
  
  export default Register;
  