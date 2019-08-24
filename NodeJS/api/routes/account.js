const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Account = require('../models/account');
const List = require('../models/list');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 1;
const expiration = { expiresIn: '1h' };

function emailLookup(email, response, next){
    Account.findOne({'email': email}, (err, account)=>{
        if (err || !account){
            response.status(403).json({message: "Access denied."});
        }else{
            next(account);
        }
    });
}


function jwtSignature(account){
    return jwt.sign({
        account
    }, process.env.SECRET_KEY, expiration);
}


router.post('/signup', (request, response, next) =>{
    var email = request.body.email;
    var password = request.body.password;

    //TODO: validate that the e-mail is unique
    
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
    
        var sig = jwtSignature(account);
        response.status(200).json({token: sig});
    })
    .catch(err => {console.log(err);});

    response.status(500);
    //TODO: create the account list
});

router.get('/login', (request, response, next) =>{
    const email = request.body.email;
    
    emailLookup(email, response, (account)=>{
        const password = request.body.password;
            //the e-mail was found, compare the password hash
            bcrypt.compare(password, account.password)
            .then(res => {
                if (res === true){
                    //TODO: return a JWT token
                    //account.token = jwt.sign(account, process.env.SECRET_KEY);
                    var sig = jwtSignature(account);
                    response.status(200).json({message: "Access granted.", token: sig});
                }else{
                    response.status(403).json({message: "Access denied."});
                }
            });
    });
});

//TODO: endpoint to update password - JWT token required

//TODO: endpoint to implement a password reset - JWT token required

//TODO: endpoint to delete account - JWT token required

module.exports = router;