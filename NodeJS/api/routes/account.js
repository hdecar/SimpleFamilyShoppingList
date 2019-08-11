const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Account = require('../models/account');
const List = require('../models/list');

router.post('/signup', (request, response, next) =>{
    //TODO: validate that the e-mail is unique
    const account = new Account({
        _id: new mongoose.Types.ObjectId(),
        listId: new mongoose.Types.ObjectId(),
        email: request.body.email,
        password: request.body.password //TODO - hash the password
    });
    const list = new List({
        _id: account.listId,
        items: []
    });
    
    account
        .save()
        .then(result => {
            console.log(result);
        })
        .catch(err => {console.log(err);});
    
    list.save()
        .then(result => {
            console.log(result);
        })
        .catch(err => {console.log(err);});

    response.status(200).json(account);
    //TODO: create the account list
});

router.get('/login', (request, response, next) =>{
    //TODO: hash password and add to search parameters
    const email = request.body.email;
    Account.findOne({'email': email}, (err, account) => {
        if (err || !account){
            response.status(403).json({message: "Access denied."});
            return;
        }
        //TODO: return JWT token with result
        response.status(200).json({message: "Access granted."});
    });
});

//TODO: update password

//TODO: implement a password reset endpoint using a JWT token

//TODO: delete account

module.exports = router;