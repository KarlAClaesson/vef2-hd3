import express from 'express';
export const userRouter = express.Router()
import { listUsers, getUser} from '../lib/db.js'
import { catchErrors } from '../lib/catch-errors.js';
import { requireAdmin, requireAuthentication } from '../lib/passport.js';

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

userRouter.post(
    '/login',
    usernameValidator,
    passwordValidator,
    usernameAndPasswordValidValidator,
    validationCheck,
    catchErrors(loginRoute)
  );

userRouter.get('/', requireAuthentication, catchErrors(userRoute));
userRouter.get('/:id', catchErrors(userIdRoute));
