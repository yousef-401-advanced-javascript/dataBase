'use strict';
require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3000;
// const notFound = require('./not-found.js');
const mongoose = require('mongoose');
const schema = require('./database.js');
const cors = require('cors')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo';
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

const app = express();
app.use(express.json());
app.use(cors());

  app.get('/', (req,res)=> res.send('hello'))
  
  app.get('/todo',async (req, res) => {
    let record = await schema.find({});
    res.json(record);
  })
  app.post('/todo',async (req, res) => {
    try {
      let record = new schema(req.body);
      let save = await record.save();
      console.log('ehl', save);
      res.json(save);
    } catch (e) {
      console.log(e.message);
    }
  })
  app.put('/todo/:id',async (req, res) => {
    let _id = req.params;
    let record = await schema.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.json(record);
  })
  app.delete('/todo/:id',async (req, res) => {
    let _id = req.params;
    let record = await schema.findByIdAndDelete(_id);
    res.json(record);
  });
// app.use('*', notFound);

app.listen(PORT, () => console.log(`Hearing from port -> ${PORT}`));