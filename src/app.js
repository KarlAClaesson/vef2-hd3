import express from 'express';
import { userRouter } from './routes/users.js';
import { eventRouter } from './routes/events.js'


const {
    PORT: port = 3000,
    SESSION_SECRET: sessionSecret,
    DATABASE_URL: connectionString,
  } = process.env;
  
if (!connectionString || !sessionSecret) {
console.error('Vantar gögn í env');
process.exit(1);
}

  const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/users', userRouter);
app.use('/events', eventRouter);

app.listen(3000)
