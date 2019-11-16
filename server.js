const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());
// server.disable('etag');

server.get('/', (req, res) => {
    res.send(`<h2>Project Default Route</h2>`)
  });

server.post('/accounts', (req, res) => {
    const accounts = req.body;
    db('accounts').insert(accounts)
        .then((id) => {
            res.status(201).json(id)
        })
        .catch(() => {
            res.status(500).json({message: "There was an error adding the account"})
        })
})

server.get('/accounts', (req, res) => {
    db('accounts')
        .then((accounts) => {
            console.log(accounts)
           res.status(200).json(accounts)
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({message: "There was an error retrieving the accounts"})
        })
});

server.get('/accounts/:id', (req, res) => {
    const {id} = req.params;

    db('accounts').where({id})
    .then(account => {
        if (account.length) {
            res.status(200).json(account);
        } else {
            res.status(404).json({ message: 'Could not find account with this ID.' })
        }
    })
    .catch (err => {
        res.status(500).json({ message: 'There was an error retrieving this account' });
      })
});

server.put("/accounts/:id", (req, res) => {
    const updatedAccount = req.body;
    const {id} = req.params;

    db('accounts').where({id: id}).update(updatedAccount)
        .then((account) => {
            if (account) {
                res.status(201).json({message: `${account} accounts have been updated`})
            } else {
                res.status(404).json({message: "Could not find account with this ID."})
            }
        })
        .catch(() => {
            res.status(500).json({message: "There was a problem updating the account."})
        })
});

server.delete('/accounts/:id', (req, res) => {
    const {id} = req.params
    db('accounts').where({id: id}).del()
    .then((count) => {
        console.log(count)
        if (count) {
            console.log(count)
            res.status(204).end();
        } else {
            res.status(404).json({ message: 'Could not find account with given id.' });
        }
    })
    .catch(err => {
        res.status(500).json({ message: 'Failed to delete account'});
    })
})

module.exports = server;