const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateUser,
  updateUserAvatar,
  getOwnerInfo,
} = require('../controllers/users.js');

router.get('/', getUsers);

router.get('/me', getOwnerInfo);

router.get('/:userId', getUser);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
