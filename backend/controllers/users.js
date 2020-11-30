const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { catchFunction, catchWithValidationFunction } = require('../utils/catch-function ');

const getUsers = (req, res) => {
  User.find({})
    .then((data) => res.send(data))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const err = new Error('Пользователь не найден');
      err.statusCode = 404;
      throw err;
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => catchFunction(res, err));
};

const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  if (!email || !password) {
    res.status(400).send({ message: 'Не передан email или password' });
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
    .catch((err) => catchWithValidationFunction(res, err));
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Не передан email или password' });
  }
  return User.findOne({ email })
    .select('+password')
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(401).send({ message: 'Неправильный email' });
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return res.status(401).send({ message: 'Неправильный пароль' });
          }
          const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
          return res.send({ token });
        })
        .catch((err) => {
          console.log(err);
          res.send({ message: err.message });
        });
    })
    .catch((err) => catchWithValidationFunction(res, err));
};

const updateUser = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  User.findByIdAndUpdate(_id,
    { name, about }, {
      runValidators: true,
      new: true,
    })
    .orFail(() => {
      const err = new Error('Пользователь не найден');
      err.statusCode = 404;
      throw err;
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => catchWithValidationFunction(res, err));
};

const updateUserAvatar = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  User.findByIdAndUpdate(_id,
    { avatar }, {
      runValidators: true,
      new: true,
    })
    .orFail(() => {
      const err = new Error('Пользователь не найден');
      err.statusCode = 404;
      throw err;
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => catchWithValidationFunction(res, err));
};

const getOwnerInfo = (req, res) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail(() => {
      const err = new Error('Пользователь не найден');
      err.statusCode = 404;
      throw err;
    })
    .then((user) => res.send(user))
    .catch((err) => catchWithValidationFunction(res, err));
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
