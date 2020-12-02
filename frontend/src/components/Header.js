import React from "react";
import { Route, Switch, Link } from 'react-router-dom';
import headerLogo from "../images/logo.svg";

function Header({loggedIn, email, onSignOut}) {
  const headerEmailClassName = ` ${
    loggedIn ? "header__email" : "header__email_hidden"
  }`; 
  return (
    <header className="header">
      <div className="header__container">
      <img
        className="header__logo"
        src={headerLogo}
        alt="Логотип Место Россия"
      />
     < div className="header__box">  
      <p className={headerEmailClassName}>{email}</p> 
      <Switch>
       <Route path="/signup">
         <Link to="/signin" className="header__link">Войти</Link>
       </Route>
       <Route path="/signin">
        <Link to="/signup" className="header__link">Регистрация</Link>
       </Route>
       < Route  exact path="/">
        <Link to="/signin" className="header__link" onClick={onSignOut}>Выйти</Link>
       </Route> 
     </Switch>
     </div>   
   </div>
    </header>
  );
}

export default Header;
