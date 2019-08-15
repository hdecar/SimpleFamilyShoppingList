const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Account = require('../models/account');
const List = require('../models/list');
const bcrypt = require('bcrypt');

const saltRounds = 1;

router.post('/signup', (request, response, next) =>{
    var email = request.body.email;
    var password = request.body.password;

    //TODO: validate that the e-mail is unique
    //TODO: encrypt the e-mail address

    bcrypt.hash(password, saltRounds)
    .then(function(hash) {
        const account = new Account({
            _id: new mongoose.Types.ObjectId(),
            listId: new mongoose.Types.ObjectId(),
            email: email,
            password: hash
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
    })
    .catch(err => {console.log(err);});

    //TODO: create the account list
});

router.get('/login', (request, response, next) =>{
    const email = request.body.email;
    const password = request.body.password;

    Account.findOne({'email': email}, (err, account) => {
        if (err || !account){
            response.status(403).json({message: "Access denied."});
        }else{

            //the e-mail was found, compare the password hash
            bcrypt.compare(password, account.password)
            .then(res => {
                console.log(res);
                if (res === true){
                    //TODO: return a JWT token
                    response.status(200).json({message: "Access granted."});
                }else{
                    response.status(403).json({message: "Access denied."});
                }
            });
        }
    })
    .catch(err => {
        response.status(403).json({message: "Access denied."});
    });
});

//TODO: endpoint to update password - JWT token required

//TODO: endpoint to implement a password reset - JWT token required

//TODO: endpoint to delete account - JWT token required

module.exports = router;