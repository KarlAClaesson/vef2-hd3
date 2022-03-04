import express from 'express';
export const userRouter = express.Router()
import { listUsers, getUser} from '../lib/db.js'
import { catchErrors } from '../lib/catch-errors.js';

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

async function userRegisterRoute(req, res) {

}

userRouter.get('/', catchErrors(userRoute));
userRouter.get('/:id', catchErrors(userIdRoute));
userRouter.post('/register', catchErrors(userRegisterRoute));