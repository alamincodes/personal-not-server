const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const objectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.1nwyb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    const allNotes = client.db("PersonalNotes").collection("note");

    // get all notes
    app.get("/notes", async (req, res) => {
      const query = {};
      const cursor = allNotes.find(query);
      const notes = await cursor.toArray();
      res.send(notes);
    });

    // get a single note
    app.get("/note/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await allNotes.findOne(query);
      res.send(result);
    });

    //   add new note
    app.post("/note", async (req, res) => {
      const newNote = req.body;
      const result = await allNotes.insertOne(newNote);
      res.send(result);
      console.log("adding new note", newNote);
    });

    // DELETE note
    app.delete("/note/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      const result = await allNotes.deleteOne(query);
      res.send(result);
    });

    // Update Note
    app.put("/note-update/:id", async (req, res) => {
      const id = req.params.id;
      const updateNote = req.body;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          // updateNote
          house: updateNote.house,
          gas: updateNote.gas,
          electricity: updateNote.electricity,
          house: updateNote.house,
          date: updateNote.date,
          total: updateNote.total,
          month: updateNote.month,
          color: updateNote.color,
        },
      };
      const result = await allNotes.updateOne(filter, updateDoc, option); //এখানে (filter, updateDoc, option) যেভাবে দেওয়া আছে ঠিক সেভাবেই দিতে হবে।
      console.log(updateDoc);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);
app.listen(port, () => {
  console.log("sever running", port);
});
