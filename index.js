const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = 3000;

const uri =
  "mongodb+srv://Community-Builders-bd-db:rtec20vt1v0a4EVP@cluster0.jmftqsk.mongodb.net/?appName=Cluster0";

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const db = client.db("Community-Builders-bd-db");
    const createEventCollection = db.collection("Create-Event");
    const joinedEventCollection = db.collection("Joined-Event");

    app.get("/create-event", async (req, res) => {
      const result = await createEventCollection.find().toArray();
      res.send(result);
    });
    app.get("/create-event/:id", async (req, res) => {
      const { id } = req.params;
      const result = await createEventCollection.findOne({
        _id: new ObjectId(id),
      });

      res.send(result);
    });
    app.get("/manage-event", async (req, res) => {
      const email = req.query.email;
      const result = await createEventCollection
        .find({ created_by: email })
        .toArray();
      res.send(result);
    });

    app.post("/create-event", async (req, res) => {
      const data = req.body;
      const result = await createEventCollection.insertOne(data);
      res.send(result);
    });
    app.post("/joined-event", async (req, res) => {
      const data = req.body;

      const result = await joinedEventCollection.insertOne(data);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
