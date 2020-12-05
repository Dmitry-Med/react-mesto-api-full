const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AiuthError = require('../errors/auth-err');
const BadRequestError = require('../errors/bad-req-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');


const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');

const getUsers = (req, res, next) => {
  User.find({})
    .then((data) => res.send(data))
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        const error = new BadRequestError('Невалидный id');
        next(error);
      } if (err.statusCode === 404) {
        const error = new NotFoundError('Пользователь не найден');
        next(error);
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  if (!email || !password) {
    throw new NotFoundError('Не передан email или password');
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new BadRequestError('Ошибка валидации');
        next(error);
      } else if (err.code === 11000) {
        const error = new ConflictError('Пользователь с таким email уже зарегистрирован');
        next(error);
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Не передан email или password');
  }
  return User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new AiuthError('Неправильный email');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AiuthError('Неправильный пароль');
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
          return res.send({ token });
        })
        .catch(() => {
          const error = new BadRequestError('Ошибка запроса пароля');
          next(error);
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new BadRequestError('Ошибка валидации');
        next(error);
      }
      next(err);
    });
};

const updateUser = (req, res, next) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  User.findByIdAndUpdate(_id,
    { name, about }, {
      runValidators: true,
      new: true,
    })
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new BadRequestError('Ошибка валидации');
        next(error);
      }
      next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  User.findByIdAndUpdate(_id,
    { avatar }, {
      runValidators: true,
      new: true,
    })
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new BadRequestError('Ошибка валидации');
        next(error);
      }
      next(err);
    });
};

const getOwnerInfo = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
  getOwnerInfo,
};
