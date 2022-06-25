const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hello Rollex!"));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7k0wg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const productCollection = client.db("rollex").collection("watches");
  const reviewCollection = client.db("rollex").collection("reviews");

  // post product
  app.post("/postproduct", async (req, res) => {
    const result = await productCollection.insertOne(req.body);
    res.send(result);
  });

  // get products
  app.get("/products", async (req, res) => {
    const result = await productCollection.find({}).toArray();
    res.send(result);
  });

  app.get("/products/:id", async (req, res) => {
    const result = await productCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray();
    res.send(result);
  });

  // post review 
  app.post("/review", async (req, res) => {
    const result = await reviewCollection.insertOne(req.body);
    res.send(result);
  });

  // get review 
  app.get("/reviews", async(req, res)=>{
    const result = await reviewCollection.find({}).toArray()
    res.send(result);
  })

  // client.close();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
