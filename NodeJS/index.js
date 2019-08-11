const Joi = require('joi');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const accountRoutes = require('./api/routes/account');
app.use('/api/account', accountRoutes);

const listRoutes = require('./api/routes/list');
app.use('/api/list', listRoutes);


app.get('/', (request, response)=>{
    response.send("Simple Family Shopping List API");
});

//db connection
mongoose.connect(process.env.MONGO_DB_CONNECTION,
 {useNewUrlParser: true})
 .then(() => console.log("MongoDB conected."))
 .catch(err => console.log("MongoDB ERROR: " + err));

// PORT
const port = process.env.PORT || 5800;
app.listen(port, () => {console.log(`Listening on port ${port}.`)})


function validateItem(item){
    const itemSchema = {
        item: Joi.string().min(1).required()
    };
    return Joi.validate(item, itemSchema);
}