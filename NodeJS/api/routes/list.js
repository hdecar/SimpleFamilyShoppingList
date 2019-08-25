const express = require('express');
const router = express.Router();
const List = require('../models/list');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

function tokenIsValid(request, next){
    const token = request.headers["token"];
    jwt.verify(token, process.env.SECRET_KEY, next);
}

//get the current list
router.get('/:id', (request, response)=>{
    tokenIsValid(request, 
        (err)=>{
            if (err){
                response.status(403).json({message: "Expired session."});
                return;
            }

            List.findOne({'_id': request.params.id}, (err, list) => {
                if (err || !list){
                    response.status(403).json({message: "List not found."});
                    return;
                }
                response.status(200).json(list);
                return;
            });
        }
    );
});

//add one item to the list
router.post('/:id', (request, response)=>{

    tokenIsValid(request, 
        (err)=>{
            if (err){
                response.status(403).json({message: "Expired session."});
                return;
            }

        List.findOne({'_id': request.params.id}, (err, list) => {
            if (err || !list){
                response.status(403).json({message: "List not found."});
                return;
            }
            
            const result = validateItem(request.body);
            if (result.error) return response.status(400).send(result.error.details[0].message);

            const item = request.body.item;

            const itemToAdd = {
                id: list.items.length + 1,
                item: item
            }

            list.items.push(itemToAdd);

            list.save()
            .then(result => {
                response.send(list);
            })
            .catch(err => {console.log(err);});
        });
    });
});

//delete one item from the list
router.delete('/:id/:itemid', (request, response)=>{

    tokenIsValid(request, 
        (err)=>{
            if (err){
                response.status(403).json({message: "Expired session."});
                return;
            }

        List.findOne({'_id': request.params.id}, (err, list) => {
            if (err || !list){
                response.status(403).json({message: "List not found."});
                return;
            }
            const itemid = request.params.itemid;
            
            //TODO: fix the following query
            List.findOne({'items': {'_id': itemid}}, (err, item)=>{

                if (err || !item) {
                    console.log(err);
                    response.status(404).send('Item not found');
                    return;
                }
                
                const index = list.items.indexOf(item[0]);
                list.items.splice(index, 1);

                list.save()
                .then(result => {
                    console.log(result);
                    response.send(list);
                })
                .catch(err => {console.log(err);});
            });

        });
    });
});

//clear the list
router.delete('/:id', (request, response)=>{
    tokenIsValid(request, 
        (err)=>{
            if (err){
                response.status(403).json({message: "Expired session."});
                return;
            }

        List.findOne({'_id': request.params.id}, (err, list) => {
            if (err || !list){
                response.status(403).json({message: "List not found."});
                return;
            }
            
            list.items = [];

            list.save()
            .then(result => {
                response.send(list);
            })
            .catch(err => {console.log(err);});
        });
    });
});


function validateItem(item){
    const itemSchema = {
        item: Joi.string().min(1).required()
    };
    return Joi.validate(item, itemSchema);
}

module.exports = router;