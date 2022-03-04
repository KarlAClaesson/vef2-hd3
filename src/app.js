import express from 'express';
import session from 'express-session';
import { userRouter } from './routes/users.js';
import { eventRouter } from './routes/events.js'
import passport from './lib/login.js';

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

app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      maxAge: 20 * 1000, // 20 sek
    })
  );

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) =>
  res.json({
    _links: {
      users: '/users',
      events: '/events',
    },
  })
);

app.use('/users', userRouter);
app.use('/events', eventRouter);

app.listen(port);
