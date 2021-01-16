const {body} = require('express-validator')

exports.messageValidators = [
  body('name', 'Имя не более 99 символов')
    .isLength({min: 0, max: 99})
    .isAlphanumeric()
    .trim(),
  body('company', '')
    .isLength({min: 3, max: 56})
    .isAlphanumeric()
    .trim(),
  body('email', 'Введите корректный email')
    .isEmail()
    .isLength({min: 3}),
  body('phone', 'Введите корректный телефон')
    .isLength({min: 0, max: 15}),
  body('message', 'Введите корректный текст')
    .isLength({min: 0, max: 1000})
    .isAlphanumeric()
    .trim(),
]