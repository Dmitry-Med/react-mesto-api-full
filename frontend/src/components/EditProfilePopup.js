import React, { useContext, useEffect, useState } from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');

  useEffect(() => {
    setName(currentUser.name);
    setAbout(currentUser.about);
  }, [currentUser]);

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeAbout(e) {
    setAbout(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      name: name,
      about: about,
    });
  }
  return (
    <PopupWithForm
      name="edit"
      isOpen={isOpen}
      title="Редактировать профиль"
      buttonText="Сохранить"
      onSubmit={handleSubmit}
      children={
        <>
          <div className="popup__input-field">
            <input
              type="text"
              name="username"
              placeholder="Имя"
              className="popup__input  popup__input_type_name"
              value={name}
              onChange={handleChangeName}
              required
              minLength="2"
              maxLength="20"
            />
            <span className="popup__error" id="username-error"></span>
          </div>
          <div className="popup__input-field">
            <input
              type="text"
              name="about"
              placeholder="Род занятий"
              className=" popup__input popup__input_type_about"
              value={about}
              onChange={handleChangeAbout}
              required
              minLength="2"
              maxLength="200"
            />
            <span className="popup__error" id="about-error"></span>
          </div>
        </>
      }
      onClose={onClose}
    />
  );
}

export default EditProfilePopup;
