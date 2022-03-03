import express from 'express';
export const userRouter = express.Router()


router.get('/', (req,res) =>{
    res.json({user: 'karl'})
})

router.get('/:id', (req,res) =>{
    res.json(posts)
})

router.post('/register', (req,res) =>{
    res.json(posts)
})

router.post('/login', (req,res) =>{
    res.json(posts)
})

router.get('/me', (req,res) =>{
    res.json(posts)
})

