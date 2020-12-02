import React from "react";
import closeButton from "../images/close-icon.svg";

function ImagePopup({ card, onClose }) {
  return (
    <div
      className={
        card ? "popup popup_theme_dark popup_opened  popup_place" : "popup"
      }
    >
      <div className="popup__place-container">
        <img
          src={card && card.link}
          alt={card && card.name}
          className="popup__image"
        />

        <button className="popup__close">
          <img
            className="popup__close-img"
            src={closeButton}
            alt="Закрывающая кнопка"
            onClick={onClose}
          />
        </button>
        <p className="popup__place-title">{card && card.name}</p>
      </div>
    </div>
  );
}

export default ImagePopup;
