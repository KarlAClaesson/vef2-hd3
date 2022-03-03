import express from 'express';
export const eventRouter = express.Router()


app.get('/', (req,res) =>{
    res.json(posts)
})

app.post('/', (req,res) =>{
    res.json(posts)
})

app.get('/:id', (req,res) =>{
    res.json(posts)
})

app.patch('/:id', (req,res) =>{
    res.json(posts)
})

app.delete('/:id', (req,res) =>{
    res.json(posts)
})

app.post('/:id/register', (req,res) =>{
    res.json(posts)
})

app.delete('/:id/register', (req,res) =>{
    res.json(posts)
})
