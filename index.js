// import express from 'express'; // ES Modules (newer way to do it and will not work on all versions of Node.js)
const express = require('express'); // CommonJS Modules will work on all versions of Node.js
const db = require('./data/hubs-model.js'); //<<<<< 1: import the database file to use find()
const server = express();

server.use(express.json()); // <<<<<< needed to parse JSON from the body

server.get('/', (req, res) => {
    res.send({ api: 'up and running...' }); // send() method is used to send an object {} it will return JSON string format.
}); //this tells the server how to handle 'get' requests

// this will GET a list of hubs
server.get('/hubs', (req, res) => {
    // get the list of hubs from the database
    // to do that you have to 
    db.find()
        .then(hubs => {
            res.status(200).json(hubs);
        })
        .catch(err => {
        console.log('error on GET /hubs', err);
        res
            .status(500)
            .json({ errorMessage: 'error getting list of hubs from database' })
    })
})

// a way to add (POST) a hub
server.post('/hubs', (req, res) => {
    // get the data the client sent
    const hubData = req.body; //express doesn't know how to parse JSON, so we need to 'teach' it by adding middleware. See server.use on line 6 above.
    // call the db and add the hub
    db.add(hubData)
        .then(hub => {
            res.status(201).json(hub);
        })
        .catch(err => {
        console.log('error on GET /hubs', err);
        res.status(500).json({ errorMessage: 'error getting list of hubs from database' }) 
    })
})

// remove a hub by it's id
server.delete('/hubs/:id', (req, res) => {
    const id = req.params.id;

    db.remove(id)
    .then(removed => {
        if(removed) {
            // there was no hub with that id
            res.status(200).json({ message: 'hubs removed successfully' });
        } else {
            res.status(404).json({ message: 'hub not found' });   
        }
    })
    .catch(err => {
        console.log('error on DELETE /hubs/:id', err);
        res.status(500).json({ errorMessage: 'error deleting hubs from database' })
    })
})

// update a hub by passing the id and the changes

const port = 4000;
server.listen(port, () => console.log(`/n ** API running on port ${port} **/n`))