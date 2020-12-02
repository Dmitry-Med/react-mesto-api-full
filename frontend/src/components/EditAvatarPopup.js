import React, { useRef, useState } from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  const [avatar, setAvatar] = useState("");
  const avatarRef = useRef();

  function handleChangeAvatar(e) {
    setAvatar(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
    setAvatar("");
  }

  return (
    <PopupWithForm
      name="update"
      isOpen={isOpen}
      title="Обновить аватар"
      buttonText="Сохранить"
      onSubmit={handleSubmit}
      children={
        <>
          <div className="popup__input-field">
            <input
              type="url"
              name="avatar"
              placeholder="Ссылка на аватар"
              className=" popup__input popup__input_type_avatar"
              value={avatar}
              ref={avatarRef}
              onChange={handleChangeAvatar}
              required
            />
            <span className="popup__error" id="avatar-error"></span>
          </div>
        </>
      }
      onClose={onClose}
    />
  );
}
export default EditAvatarPopup;
