import React from "react";
import closeButton from "../images/close-icon.svg";

function PopupWithForm({
  isOpen,
  name,
  title,
  children,
  onSubmit,
  buttonText,
  onClose,
}) {
  return (
    <div
      className={
        isOpen ? `popup popup__${name} popup_opened` : ` popup popup__${name}`
      }
    >
      <div className="popup__container">
        <button className="popup__close">
          <img
            className="popup__close-img"
            src={closeButton}
            alt="Закрывающая кнопка"
            onClick={onClose}
          />
        </button>
        <h2 className="popup__title">{title}</h2>
        <form
          name={`${name}form`}
          className={`popup__form popup__form_${name}`}
          onSubmit={onSubmit}
          noValidate
        >
          {children}
          <button className="popup__button" type="submit">
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;
