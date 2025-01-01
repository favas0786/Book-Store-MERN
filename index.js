import express, { response } from "express";
import { PORT, mongoDBURL } from "./config.js"
import mongoose from "mongoose";
import { Book } from './models/bookModels.js'

const app = express();

app.use(express.json())

app.get('/', (req, res) => {
    console.log(req);

});

app.post('/books', async(req, res) => {
    try {
        if (!req.body.title ||
            !req.body.author ||
            !req.body.publishYear
        ) {
            return response.status(400).send({
                message: 'Send all required fields: title, author , publishYear',
            });
        }
        const newBook = {
            title: req.body.title,
            author:req.body.author,
            publishYear:req.body.publishYear,
        };

        const book = await Book.create(newBook);
        return res.status(201).send(book)
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
})

app.get('/book', async (req,res)=>{
    try{
        const books = await Book.find({})

        return res.status(200).json(books)
    }catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message })
    }
})


mongoose.connect(mongoDBURL)
    .then(() => {
        console.log('App connected to database');
        app.listen(PORT, () => {
            console.log(`App is listening to port: ${PORT}`);

        })


    }).catch((error) => {
        console.log(error);

    })
