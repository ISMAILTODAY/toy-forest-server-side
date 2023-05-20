const express = require('express');
require('dotenv').config()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cbzwi67.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        client.connect();
        // Send a ping to confirm a successful connection

        const toyDb = client.db('allToysData');
        const toyCollection = toyDb.collection('toyData')



        app.get("/alldata", async (req, res) => {
            console.log(req.query.sort)
            const sorts = { price: req.query.sort }
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }

            const result = await toyCollection.find(query).sort(sorts).toArray();
            res.json(result);
            // console.log(result)
        })


        app.get('/alldata', async (req, res) => {
            // console.log(req.query)
            const cursor = toyCollection.find();
            const result = await cursor.toArray();
            res.json(result);
        })


        app.post('/alldata', async (req, res) => {
            const addToys = req.body;
            // console.log(req.body)
            const result = await toyCollection.insertOne(addToys);
            res.json(result);
        })

        app.put('/alldata/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            // console.log(user)
            const filter = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const updatedUser = {
                $set: {
                    quantity: user.quantity,
                    price: user.price,
                    description: user.description

                }
            }
            const result = await toyCollection.updateOne(filter, updatedUser, option);
            res.json(result);
        })

        app.delete('/alldata/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.deleteOne(query);
            res.json(result);
        })

        // app.get("/dataascending", async (req, res) => {
        //     console.log(req.query.email)
        //     let query = {};
        //     if (req.query?.email) {
        //         query = { email: req.query.email }
        //     }

        //     const result = await toyCollection.find(query).sort({ price: 1 }).toArray();
        //     res.send(result);
        //     console.log(result)
        // })











        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('toy is running')
})

app.listen(port, () => {
    // console.log(`toy is runnig on port ${port}`)
})