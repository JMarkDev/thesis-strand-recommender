const { body, validationResult } = require('express-validator');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex for demonstration

// Simple regex for password: At least 8 characters, at least one uppercase letter, one lowercase letter, and one digit
// const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

const loginValidationRules = () => {
  return [
    body('username')
      .custom((value, { req }) => {
        if (!value) {
          throw new Error('Username is required');
        }

        if (!value.match(emailRegex)) {
          throw new Error('Enter a valid email address (e.g. sample@example.com).');
        }

        return true;
      }),
    body('password').notEmpty().withMessage('Password is required'),
  ];
};

const registerValidationRules = () => {
  return [
    body('name').notEmpty().withMessage('Name is required'),
    body('username')
      .custom((value, { req }) => {
        if (!value) {
          throw new Error('Username is required');
        }

        if (!value.match(emailRegex)) {
          throw new Error('Enter a valid email address (e.g. sample@example.com).');
        }

        return true;
      }),
    body('password')
      .custom((value, { req }) => {
        if (!value) {
          throw new Error('Password is required');
        }

        if (value.length < 8) {
          throw new Error('Password must be at least 8 characters');
        }

        return true;
      }),
      body('confirmPassword')
      .custom((value, { req }) => {
        if (!value) {
          throw new Error('Confirm password is required');
        }

        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }

        return true;
      }),
      // .notEmpty().withMessage('Password is required')
      // .isLength({min: 8}).withMessage('Password must be at least 8 characters'),
    body('gender').notEmpty().withMessage('Select your gender.'),
  ];
};

const passwordValidationRules = () => {
  return [
    body('password')
      .custom((value, { req }) => {
        if (!value) {
          throw new Error('Password is required');
        }

        if (value.length < 8) {
          throw new Error('Password must be at least 8 characters');
        }

        return true;
      }),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (!value) {
          throw new Error('Confirm password is required');
        }

        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }

        return true;
      }),
  ];
}

const updateUsernameValidationRules = () => {
  return [
    body('username')
      .custom((value, { req }) => {
        if (!value) {
          throw new Error('Username is required');
        }

        if (!value.match(emailRegex)) {
          throw new Error('Enter a valid email address (e.g. sample@example.com).');
        }

        return true;
      }),
  ]
}

const validateForm = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({ errors: errors.array() });
};

module.exports = {
  loginValidationRules,
  validateForm,
  registerValidationRules,
  passwordValidationRules,
  updateUsernameValidationRules
};
