const router = require('express').Router();
const usersRoutes = require('./users.js');
const cardsRoutes = require('./cards.js');
const auth = require('../middlewares/auth');
const {
  login,
  createUser,
} = require('../controllers/users.js');

router.post('/signin', login);
router.post('/signup', createUser);
router.use(auth);
router.use('/users', usersRoutes);
router.use('/cards', cardsRoutes);
router.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = router;
