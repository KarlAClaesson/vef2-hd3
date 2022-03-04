import express from 'express';
export const router = express.Router()
export const eventRouter = express.Router()
import { catchErrors } from '../lib/catch-errors.js';


import { listEvent, listEvents, listRegistered, register } from '../lib/db.js';

async function indexRoute(req, res) {
    const events = await listEvents()

    res.status(203).json({
        title: 'Viðburðasíðan',
        admin: false,
        events,
      });
}

async function eventRoute(req, res, next) {
    const { id } = req.params;
    console.log(id);
    const event = await listEvent(id);
    console.log(event);
  
    if (!event) {
      return next();
    }
  
    const registered = await listRegistered(event.id);
  
    return res.status(203).json( {
      title: `${event.name} — Viðburðasíðan`,
      event,
      registered,
      errors: [],
      data: {},
    });
}

/* async function registerRoute(req, res) {
    const { name, comment } = req.body;
    const { slug } = req.params;
    const event = await listEvent(slug);

    const registered = await register({
        name,
        comment,
        event: event.id,
    });

    if (registered) {
        return res.redirect(`/${event.slug}`);
    }

    return res.send('error');
} */


eventRouter.get('/', catchErrors(indexRoute));
eventRouter.get('/:id', catchErrors(eventRoute));
/* eventRouter.post('/:id/register', catchErrors(registerRoute)); */