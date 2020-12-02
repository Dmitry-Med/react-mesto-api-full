import React, { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card({ card, onCardClick, onCardDelete, onCardLike }) {
  const currentUser = useContext(CurrentUserContext);
  const isOwn = card.owner._id === currentUser._id;
  const cardTrashButtonClassName = ` ${
    isOwn ? "card__trash" : "card__trash_hidden"
  }`;
  const isLiked = card.likes.some((i) => i._id === currentUser._id);
  const cardLikeButtonClassName = `${
    isLiked ? "card__like_active" : "card__like"
  }`;

  return (
    <li className="card">
      <img
        src={card.link}
        alt={card.name}
        className="card__image"
        onClick={(_) => onCardClick(card)}
      />
      <button
        type="button"
        className={cardTrashButtonClassName}
        onClick={(_) => onCardDelete(card)}
      ></button>
      <div className="card__text-box">
        <h3 className="card__title">{card.name}</h3>
        <div className="card__like-box">
          <button
            type="button"
            className={cardLikeButtonClassName}
            onClick={(_) => onCardLike(card)}
          ></button>
          <p className="card__like-counter">{card.likes.length}</p>
        </div>
      </div>
    </li>
  );
}

export default Card;
