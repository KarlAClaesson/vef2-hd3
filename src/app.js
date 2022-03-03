import express from 'express';
const app = express();

import { userRouter } from './routes/users.js';
import { eventRouter } from './routes/events.js';

app.get('/', (req,res) => {
    console.log('here')
});

app.use('/users', userRouter);
app.use('/events', eventRouter);


app.listen(8000)
