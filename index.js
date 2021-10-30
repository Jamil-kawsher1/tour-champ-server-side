const express = require('express');
const cors = require('cors');
require("dotenv").config();
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l9s2s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        console.log('Connected To database');
        const database = client.db("tour_champ")
        const services = database.collection('services');
        const cart = database.collection('cart');
        const order = database.collection('order');
        //add new service
        app.post('/addService', async (req, res) => {
            const newservice = req.body;
            const result = await services.insertOne(newservice);
            res.json(result);

        })
        // app.get or viwe all service 
        app.get('/services', async (req, res) => {
            const cursor = services.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        // single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await services.findOne(query)
            res.send(result);
        })

        //placeorder
        app.post('/placeorder', async (req, res) => {
            const neworder = req.body;
            const result = await order.insertOne(neworder);
            res.json(result);

        })


    }
    finally {

    }
}
run().catch(console.dir);



app.get('', (req, res) => {
    res.send("Hello This is Tour champ test server");
})



app.listen(port, () => {
    console.log("listing at Port ", port);
})
