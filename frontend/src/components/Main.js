import React, { useContext } from "react";
import editButton from "../images/pen.svg";
import addButton from "../images/plus.svg";
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Main({
  cards,
  onEditProfile,
  onAddPlace,
  onEditAvatar,
  onCardClick,
  onCardLike,
  onCardDelete,
}) {
  const currentUser = useContext(CurrentUserContext);  

  return (
    <main className="content">
      <section className="profile">
        <button
          type="button"
          className="profile__avatar "
          onClick={onEditAvatar}
          style={{ backgroundImage: ` url(${currentUser.avatar})` }}
        />
        <div className="profile__text-box">
          <div className="profile__name-box">
            <h1 className="profile__name">{currentUser.name}</h1>
            <button
              className="edit-button edit-button_opened"
              onClick={onEditProfile}
            >
              <img
                className="edit-button__img"
                src={editButton}
                alt="Кнопка редактирования"
              />
            </button>
          </div>
          <p className="profile__about">{currentUser.about}</p>
        </div>
        <button className="add-button add-button_opened" onClick={onAddPlace}>
          <img
            className="add-button__img"
            src={addButton}
            alt="Кнопка Добавить"
          />
        </button>
      </section>
      <section className="cards" aria-label="Карточки">
        <ul className="cards__list">
          {cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              onCardClick={onCardClick}
              onCardDelete={onCardDelete}
              onCardLike={onCardLike}
            />
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Main;
