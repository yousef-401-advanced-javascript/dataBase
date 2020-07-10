'use strict';
require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3000;
// const notFound = require('./not-found.js');
const mongoose = require('mongoose');
const schema = require('./database.js');
const usersSchema = require('./userModel');
const basicAuth = require('./basic');
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

app
  .route('/todo')
  .get(async (req, res) => {
    let record = await schema.find({});
    res.json(record);
  })
  .post(async (req, res) => {
    try {
      let record = new schema(req.body);
      let save = await record.save();
      console.log('ehl', save);
      res.json(save);
    } catch (e) {
      console.log(e.message);
    }
  })
  .put(async (req, res) => {
    let _id = req.headers.bo;
    console.log('_id',_id)
    let record = await schema.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.json(record);
  })
  .delete(async (req, res) => {
    let _id = req.body;
    let record = await schema.findByIdAndDelete(req.headers.bo);
    console.log(record)
    res.json(record);
  });

  ///////////////////////ksjdksjd\\\\\\\\\\\\\\\\\\\\\
  app.post('/signup', async (req, res) => {
    try {
      console.log(req.body);
      let users = new usersSchema(req.body);
      let result = await users.save();
      let token = usersSchema.generateToken(result);
      res.status(200).send({ result, token });
    } catch (e) {
      console.error(e);
    }
  });
  
  app.post('/signin', basicAuth, (req, res) => {
  
    // let token = req.token;
    let token = usersSchema.generateToken(req.data);
    res.cookie('token', token);
  
    let roles = {
      user: ['read'],
      writers: ['read', 'create'],
      editors: ['read', 'update', 'create'],
      admin: ['read', 'update', 'create', 'delete'],
    };
    let note1 = 'THIS is a note for you guys ---> users roles have these capabilities';
    let note2 = `user: ['read']`
    let note3 = `writers: ['read', 'create']`
    let note4 = `editors: ['read', 'update', 'create']`
    let note5 = `admin: ['read', 'update', 'create', 'delete']`
  
    res.status(200).json({ note1, note2, note3, note4, note5, 'token': token, 'user': req.data, capabilities: roles[req.data.role] });
  });
  
  app.get('/users', async (req, res) => {
  
    let users = await usersSchema.findAll();
    res.status(200).json({ users });
  });
  
  
  // app.use(error404);
  // app.use(error500);
  
  // module.exports = {
  //   server: app,
  //   start: (portNumber) => app.listen(portNumber, () => console.log(`Listnening to PORT ${portNumber}`)),
  // };
// app.use('*', notFound);

app.listen(PORT, () => console.log(`Hearing from port -> ${PORT}`));