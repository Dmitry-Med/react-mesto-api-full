const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const usersRoutes = require('./users.js');
const cardsRoutes = require('./cards.js');
const auth = require('../middlewares/auth');
const {
  login,
  createUser,
} = require('../controllers/users.js');
const NotFoundError = require('../errors/not-found-err');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), createUser);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);
router.use(auth);
router.use('/users', usersRoutes);
router.use('/cards', cardsRoutes);
router.use('*', (req, res, next) => {
  const err = new NotFoundError('Запрашиваемый ресурс не найден');
  next(err);
});

module.exports = router;
