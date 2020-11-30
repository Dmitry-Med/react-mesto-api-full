const catchWithValidationFunction = (res, err) => {
  if (err.name === 'ValidationError') {
    const errorList = Object.keys(err.errors);
    const messages = errorList.map((item) => err.errors[item].message);
    return res.status(400).send({ message: `Ошибка валидации: ${messages.join(' ')}` });
  } return res.status(500).send({ message: 'Ошибка на сервере' });
};

const catchFunction = (res, err) => {
  if (err.kind === 'ObjectId') {
    return res.status(400).send({ message: 'Невалидный id' });
  } if (err.statusCode === 404) {
    return res.status(404).send({ message: 'Объект поиска не найден' });
  } return res.status(500).send({ message: 'Ошибка на сервере' });
};

module.exports = { catchFunction, catchWithValidationFunction };
