const Card = require('../models/card');
const {
  catchFunction,
  catchWithValidationFunction,
} = require('../utils/catch-function ');

const getCards = (req, res) => {
  Card.find({})
    .populate(['likes', 'owner'])
    .then((data) => res.send(data))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({
    name,
    link,
    owner: _id,
  })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => catchWithValidationFunction(res, err));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findById(cardId)
    .populate('owner')
    .orFail(() => {
      const err = new Error('Карточка не найдена');
      err.statusCode = 404;
      throw err;
    })
    .then((card) => {
      if (card.owner.toString() === userId) {
        Card.findByIdAndRemove(cardId).then((newCard) => {
          res.send(newCard);
        });
      } else {
        const err = new Error('Нельзя удалять чужую карточку');
        throw err;
      }
    })
    .catch((err) => catchFunction(res, err));
};

const addLike = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } },
    { runValidators: true, new: true },
  )
    .populate(['likes', 'owner'])
    .orFail(() => {
      const err = new Error('Карточка не найдена');
      err.statusCode = 404;
      throw err;
    })
    .then((card) => res.send(card))
    .catch((err) => catchFunction(res, err));
};

const deleteLike = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: _id } },
    { runValidators: true, new: true }
  )
    .populate(['likes', 'owner'])
    .orFail(() => {
      const err = new Error('Карточка не найдена');
      err.statusCode = 404;
      throw err;
    })
    .then((card) => res.send(card))
    .catch((err) => catchFunction(res, err));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
};
