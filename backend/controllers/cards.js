const Card = require('../models/card');
const BadRequestError = require('../errors/bad-req-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

const getCards = (req, res, next) => {
  Card.find({})
    .then((data) => res.send(data))
    .catch(next);
};

const createCard = (req, res, next) => {
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
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        const error = new BadRequestError('Невалидный id');
        next(error);
      } if (err.name === 'ValidationError') {
        const error = new BadRequestError('Ошибка валидации');
        next(error);
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findById(cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => {
      if (card.owner._id.toString() === userId) {
        Card.findByIdAndRemove(cardId).then((newCard) => {
          res.send(newCard);
        });
      } else {
        throw new ConflictError('Нельзя удалять чужую карточку');
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        const error = new BadRequestError('Невалидный id');
        next(error);
      } if (err.name === 'ValidationError') {
        const error = new BadRequestError('Ошибка валидации');
        next(error);
      }
      next(err);
    });
};

const addLike = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { runValidators: true, new: true })
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        const error = new BadRequestError('Невалидный id');
        next(error);
      } if (err.statusCode === 404) {
        const error = new NotFoundError('Карточка не найдена');
        next(error);
      }
      next(err);
    });
};

const deleteLike = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { runValidators: true, new: true })
    .orFail(() => {
      const err = new Error('Карточка не найдена');
      err.statusCode = 404;
      throw err;
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        const error = new BadRequestError('Невалидный id');
        next(error);
      } if (err.statusCode === 404) {
        const error = new NotFoundError('Карточка не найдена');
        next(error);
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
};
