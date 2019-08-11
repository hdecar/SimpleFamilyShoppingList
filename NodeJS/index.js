const Joi = require('joi');
const express = require('express');

const app = express();
app.use(express.json());

//TODO: this will be saved to a database
var list = 
[
    {"id": 1, "item": "eggs"},
    {"id": 2, "item": "milk"},
];

app.get('/', (request, response)=>{
    response.send("Simple Family Shopping List API");
});

//get the current list
app.get('/api/list/', (request, response)=>{
    response.send(list);
});

//add one item to the list
app.post('/api/list/', (request, response)=>{
    const result = validateItem(request.body);
    if (result.error) return response.status(400).send(result.error.details[0].message);

    const item = request.body.item;

    const itemToAdd = {
        id: list.length + 1,
        item: item
    }

    list.push(itemToAdd);
    response.send(list);
});

//delete one item from the list
app.delete('/api/list/:id', (request, response)=>{
    const id = parseInt(request.params.id);
    const item = list.find(x=>x.id === id);

    if (!list) return response.status(404).send('Item not found');
    
    const index = list.indexOf(item);
    list.splice(index, 1);
    response.send(list);
});

//clear the list
app.delete('/api/list/', (request, response)=>{
    list = [];
    response.send(list);
});

// PORT
const port = process.env.PORT || 5800;
app.listen(port, () => {console.log(`Listening on port ${port}.`)})


function validateItem(item){
    const itemSchema = {
        item: Joi.string().min(1).required()
    };
    return Joi.validate(item, itemSchema);
}