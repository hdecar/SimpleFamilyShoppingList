const express = require('express');
const router = express.Router();
const List = require('../models/list');
const Joi = require('joi');

//get the current list
router.get('/:id', (request, response)=>{
    List.findOne({'_id': request.params.id}, (err, list) => {
        if (err || !list){
            response.status(403).json({message: "List not found."});
            return;
        }
        //TODO: return JWT token with result
        response.status(200).json(list);
    });
});

//add one item to the list
router.post('/:id', (request, response)=>{
    List.findOne({'_id': request.params.id}, (err, list) => {
        if (err || !list){
            response.status(403).json({message: "List not found."});
            return;
        }
        //TODO: return JWT token with result
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
            console.log(result);
            response.send(list);
        })
        .catch(err => {console.log(err);});
    });
});

//delete one item from the list
router.delete('/:id/:itemid', (request, response)=>{
    List.findOne({'_id': request.params.id}, (err, list) => {
        if (err || !list){
            response.status(403).json({message: "List not found."});
            return;
        }
        const itemid = parseInt(request.params.itemid);
        const item = list.items.find(x=>x.id === itemid);

        if (!list) return response.status(404).send('Item not found');
        
        const index = list.items.indexOf(item);
        list.items.splice(index, 1);

        list.save()
        .then(result => {
            console.log(result);
            response.send(list);
        })
        .catch(err => {console.log(err);});
    });
});

//clear the list
router.delete('/:id', (request, response)=>{
    List.findOne({'_id': request.params.id}, (err, list) => {
        if (err || !list){
            response.status(403).json({message: "List not found."});
            return;
        }
        
        list.items = [];

        list.save()
        .then(result => {
            console.log(result);
            response.send(list);
        })
        .catch(err => {console.log(err);});
    });
});


function validateItem(item){
    const itemSchema = {
        item: Joi.string().min(1).required()
    };
    return Joi.validate(item, itemSchema);
}

module.exports = router;