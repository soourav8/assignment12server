const express = require('express');
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to Summer Camp !')
})

//monogdb added
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.umaiywo.mongodb.net/?retryWrites=true&w=majority`;

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

        const database = client.db("campDb");

        const classCollection = database.collection("classes");
        const instructorCollection = database.collection("instructors");
        const userCollection = database.collection("users");
        //get classes
        app.get('/classes', async (req, res) => {
            const results = await classCollection.find().toArray();
            res.send(results)

        })
        //get instructors
        app.get('/instructors', async (req, res) => {
            const results = await instructorCollection.find().toArray();
            res.send(results)

        })

        app.post('/users', async (req, res)=> {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })






        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);














app.listen(port, () => {
    console.log(`camp server listening on port ${port}`)
})