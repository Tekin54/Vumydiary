import { body } from 'express-validator';

const validateSignup = [
  body('firstName')
    .trim()
    .isLength({ min: 3 })
    .withMessage('First name must be at least 3 characters long'),

  body('lastName')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Last name must be at least 3 characters long'),

  body('email').trim().isEmail().withMessage('Invalid email'),

  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),

  body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

const validateSignin = [
  body('email').trim().isEmail().withMessage('Invalid email'),

  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

const validateUpdatePassword = [
  body('oldPassword')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Old password must be at least 8 characters long'),

  body('newPassword')
    .trim()
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long'),

  body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

const validateUpdateName = [
  body('newFirstName')
    .trim()
    .isLength({ min: 3 })
    .withMessage('First name must be at least 3 characters long'),

  body('newLastName')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Last name must be at least 3 characters long'),

  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

export { validateSignup, validateSignin, validateUpdatePassword, validateUpdateName };
