// this is full for courses collection

const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017"; 
const dbName = "codinggita";

// Middleware
app.use(express.json());

let db, courses;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        courses = db.collection("courses");

        // Start server after successful DB connection
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit if database connection fails
    }
}

// Initialize Database
initializeDatabase();

// Routes

// GET: List all courses
app.get('/courses', async (req, res) => {
    try {
        const allcourses = await courses.find().toArray();
        res.status(200).json(allcourses);
    } catch (err) {
        res.status(500).send("Error fetching courses: " + err.message);
    }
});

// POST: Add a new course
app.post('/courses', async (req, res) => {
    try {
        // console.log("Request Object: ", req)
        // console.log("Request Object: ", req.body)
        const newcourse = req.body;
        const result = await courses.insertOne(newcourse);
        res.status(201).send(`course added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding course: " + err.message);
    }
});

// PUT: Update a course completely
app.put('/courses/:_id', async (req, res) => {
    try {
        console.log("Request Params: ", req.params)
        console.log("Request Body: ", req.body)
        const _id = (req.params._id);
        const updatedcourse = req.body;
        const result = await courses.replaceOne({ _id : new ObjectId(_id) }, updatedcourse);
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error updating course: " + err.message);
    }
});

// PATCH: Partially update a course
app.patch('/courses/:_id', async (req, res) => {
    try {
        const _id = (req.params._id);
        const updates = req.body;
        const result = await courses.updateOne({ _id : new ObjectId(_id) }, { $set: updates });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error partially updating course: " + err.message);
    }
});

// DELETE: Remove a course
app.delete('/courses/:_id', async (req, res) => {
    try {
        const _id = (req.params._id);
        const result = await courses.deleteOne({ _id : new ObjectId(_id) });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting course: " + err.message);
    }
});

// app.delete('/courses/del/:name', async (req, res) => {
//     try {
//         // console.log(name)
//         const name = (req.params.name);
//         const result = await courses.deleteOne({ name });
//         res.status(200).send(${result.deletedCount} document(s) deleted);
//     } catch (err) {
//         res.status(500).send("Error deleting course: " + err.message);
//     }
// });