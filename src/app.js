import express from 'express';
const app = express();


import { userRouter } from './routes/users.js';

import { eventRouter } from './routes/events.js'

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/users', userRouter);
app.use('/events', eventRouter);

app.listen(3000)
