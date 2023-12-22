
const express = require('express')
const app = express()
require('dotenv').config()
var cors = require('cors')
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())





const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.uinjrty.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();
        const database = client.db("taskDB");
        const taskCollection = database.collection("task");


        app.post("/task", async (req, res) => {
            const data = req.body;
            const email = req.query.email;
            data.email = email;
            const result = await taskCollection.insertOne(data)
            res.send(result)
        })


        app.get("/get-task", async (req, res) => {
            const email = req.query.email;
            const query = {
                email: email
            }
            const result = await taskCollection.find(query).toArray();
            res.send(result)
        })

        app.delete("/delete-task/:id", async (req, res) => {
            const id = req.params
            const query = { _id: new ObjectId(id) }
            const result = await taskCollection.deleteOne(query);
            res.send(result)
        })

        app.patch("/update-task/:id", async (req, res) => {
            const id = req.params
            const data = req.body;
            console.log(id, data);
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    title: data.title,
                    description: data.description,
                    date: data.date,
                    priority: data.priority
                }
            }
            const result = await taskCollection.updateOne(query, updateDoc, options);
            res.send(result)


        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})