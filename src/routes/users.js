import express from 'express';
export const userRouter = express.Router()
import { listUsers, getUser} from '../lib/db.js'
import { catchErrors } from '../lib/catch-errors.js';
import { requireAdmin, requireAuthentication, jwtOptions, tokenOptions } from '../lib/passport.js';
import { validationCheck } from '../validation/helpers.js';
import { findByUsername } from '../lib/auth.js';
import jwt from 'jsonwebtoken';


import {
    passwordValidator,
    usernameAndPasswordValidValidator,
    usernameDoesNotExistValidator,
    usernameValidator,
  } from '../validation/validators.js';

async function userRoute(req, res) {
    const users = await listUsers();

    res.status().json('500', {
        users
    })
}

async function userIdRoute(req, res) {
    const { id } = req.params;
    const user = await getUser(id);

    res.status().json('500', {
        user
    })
}

async function loginRoute(req, res) {
    const { username } = req.body;

    const user = await findByUsername(username);

    if (!user) {
        logger.error('Unable to find user', username);
        return res.status(500).json({});
    }
 
    const payload = { id: user.id };
    const token = jwt.sign(payload, jwtOptions.secretOrKey, tokenOptions);
    delete user.password;

    return res.json({
        user,
        token,
        expiresIn: tokenOptions.expiresIn,
    });
}

userRouter.post(
    '/login',
  /*   usernameValidator,
    passwordValidator,
    usernameAndPasswordValidValidator,
    validationCheck, */
    catchErrors(loginRoute)
  );

userRouter.get('/', requireAuthentication, catchErrors(userRoute));
userRouter.get('/:id', catchErrors(userIdRoute));
userRouter.get('/login', catchErrors(loginRoute))
