import React from "react";
import closeButton from "../images/close-icon.svg";
import unionDisonnect from "../images/union-no.png";
import unionConnect from "../images/union-yes.png";


function InfoTooltip ({ status, onClose, isOpen}) {
    return ( 
      <div className= {
        isOpen ? " popup popup_opened" : "popup" } >
        <div className="popup__container">
        <button className="popup__close">
          <img
            className="popup__close-img"
            src={closeButton}
            alt="Закрывающая кнопка"
            onClick={onClose}
          />        
        </button>
        <img
            className="popup__union-img"
            src={ (status === 'sucess') ? unionConnect : unionDisonnect }
            alt="Значок соединения"            
        />
        < h2 className="popup__union-text">
          { (status === 'sucess') ? "Вы успешно зарегистрировались!" : "Что-то пошло не так!Попробуйте ещё раз." }
        </h2>
        </div>
      </div>      
    );
  }

  export default InfoTooltip;