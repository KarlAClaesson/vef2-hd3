import { body, query } from 'express-validator';
import xss from 'xss';
import { comparePasswords, findByUsername } from '../lib/auth.js';
import { LoginError } from '../errors.js';
import { listEvent } from '../lib/db.js';
import { logger } from '../lib/logger.js';

/**
 * Collection of validators based on express-validator
 */

export const pagingQuerystringValidator = [
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('query parameter "offset" must be an int, 0 or larger'),
  query('limit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('query parameter "limit" must be an int, larger than 0'),
];

/*
export function validateResourceExists(fetchResource) {
  return [
    param('id').custom(resourceExists(fetchResource)).withMessage('not found'),
  ];
}
export function validateResourceNotExists(fetchResource) {
  return [
    param('id')
      .not()
      .custom(resourceExists(fetchResource))
      .withMessage('already exists'),
  ];
} */

export const usernameValidator = body('username')
  .isLength({ min: 1, max: 256 })
  .withMessage('username is required, max 256 characters');

const isPatchingAllowAsOptional = (value, { req }) => {
  if (!value && req.method === 'PATCH') {
    return false;
  }

  return true;
};

export const nameValidator = body('name')
  .if(isPatchingAllowAsOptional)
  .isLength({ min: 1, max: 256 })
  .withMessage('name is required, max 128 characters');

export const passwordValidator = body('password')
  .if(isPatchingAllowAsOptional)
  .isLength({ min: 10, max: 256 })
  .withMessage('password is required, min 10 characters, max 256 characters');

export const usernameDoesNotExistValidator = body('username').custom(
  async (username) => {
    const user = await findByUsername(username);

    if (user) {
      return Promise.reject(new Error('username already exists'));
    }
    return Promise.resolve();
  }
);

export const usernameAndPasswordValidValidator = body('username').custom(
  async (username, { req: { body: reqBody } = {} }) => {
    // Can't bail after username and password validators, so some duplication
    // of validation here
    // TODO use schema validation instead?
    const { password } = reqBody;

    if (!username || !password) {
      return Promise.reject(new Error('skip'));
    }

    let valid = false;
    try {
      const user = await findByUsername(username);
      valid = await comparePasswords(password, user.password);
    } catch (e) {
      // Here we would track login attempts for monitoring purposes
      logger.info(`invalid login attempt for ${username}`);
    }

    if (!valid) {
      return Promise.reject(new LoginError('username or password incorrect'));
    }
    return Promise.resolve();
  }
);

export const inProductionValidator = body('inproduction')
  .if(isPatchingAllowAsOptional)
  .exists()
  .withMessage('inproduction is required')
  .isBoolean({ strict: false })
  .withMessage('inproduction must be a boolean');

export const adminValidator = body('admin')
  .exists()
  .withMessage('admin is required')
  .isBoolean()
  .withMessage('admin must be a boolean')
  .bail()
  .custom(async (admin, { req: { user, params } = {} }) => {
    let valid = false;

    const userToChange = parseInt(params.id, 10);
    const currentUser = user.id;

    if (Number.isInteger(userToChange) && userToChange !== currentUser) {
      valid = true;
    }

    if (!valid) {
      return Promise.reject(new Error('admin cannot change self'));
    }
    return Promise.resolve();
  });

export const requireUserCreatedOrIsAdmin = async (req, res, next) => {
  const { id } = req.params;

  const event = await listEvent(id);

  try {
    if (!(req.user.admin || req.user.id === event.creator_id)) {
      return res.status(403).json({
        error: 'Insufficient authorization',
      });
    }

    return next();
  } catch {
    return res.status(404).json({ error: 'Not found' });
  }
};

// Endurn??tum mj??g l??ka validation

export const requireNameNonempty = body('name')
  .isLength({ min: 1 })
  .withMessage('Vi??bur??ur ver??ur a?? hafa nafn');

export function registrationValidationMiddleware(textField) {
  return [
    body('name')
      .isLength({ max: 64 })
      .withMessage('Nafn m?? a?? h??marki vera 64 stafir'),
    body(textField)
      .isLength({ max: 400 })
      .withMessage(
        `${
          textField === 'comment' ? 'Athugasemd' : 'L??sing'
        } m?? a?? h??marki vera 400 stafir`
      ),
  ];
}

// Viljum keyra s??r og me?? validation, ver gegn ???self XSS???
export function xssSanitizationMiddleware(textField) {
  return [body(textField).customSanitizer((v) => xss(v))];
}

export function sanitizationMiddleware(textField) {
  return [body(textField).trim().escape()];
}