import React, { useState } from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeLink(e) {
    setLink(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace({
      name: name,
      link: link,
    });
    setName("");
    setLink("");
  }

  return (
    <PopupWithForm
      name="add"
      isOpen={isOpen}
      title="Новое место"
      buttonText="Создать"
      onSubmit={handleSubmit}
      children={
        <>
          <div className="popup__input-field">
            <input
              type="text"
              name="name"
              placeholder="Название"
              className="popup__input popup__input_type_cardname"
              value={name}
              onChange={handleChangeName}
              required
              minLength="1"
              maxLength="30"
            />
            <span className="popup__error" id="name-error"></span>
          </div>
          <div className="popup__input-field">
            <input
              type="url"
              name="link"
              placeholder="Ссылка на картинку"
              className=" popup__input popup__input_type_link"
              value={link}
              onChange={handleChangeLink}
              required
            />
            <span className="popup__error" id="link-error"></span>
          </div>
        </>
      }
      onClose={onClose}
    />
  );
}
export default AddPlacePopup;
