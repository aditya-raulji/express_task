const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

const dbName = "codinggita";
const coursesCollection = "courses";

function main() {
    client
        .connect()
        .then(() => {
            console.log("Connected to MongoDB");
            const db = client.db(dbName);
            const courses = db.collection(coursesCollection);

            // Chain all operations using Promises
            return addNewCourse(courses)
                .then(() => updateCourseDetails(courses))
                .then(() => deleteCourse(courses))
                .then(() => listCourses(courses));
        })
        .then(() => {
            client.close();
            console.log("Connection closed");
        })
        .catch((err) => {
            console.error("Error:", err);
        });
}

function addNewCourse(collection) {
    const newCourse = {
        courseCode: "CS125", 
        courseName: "B.COM", 
        credits: 8, 
        instructor: "Prof. Hemang"
    };
    
      
    return collection.insertOne(newCourse).then((result) => {
        console.log("New course added:", result.insertedId);
    });
}

function updateCourseDetails(collection) {
    const filter = { courseName: "CS101" };
    const update = {
        $set: {
            credits: 9, 
        instructor: "Prof. Aditya"
        },
    };

    return collection.updateOne(filter, update).then((result) => {
        console.log(`${result.modifiedCount} document(s) updated`);
    });
}

function deleteCourse(collection) {
    const filter = { courseName: "CS102" };

    return collection.deleteOne(filter).then((result) => {
        console.log(`${result.deletedCount} document(s) deleted`);
    });
}

function listCourses(collection) {
    return collection.find().toArray().then((courses) => {
        console.log("Current list of courses:", courses);
    });
}

main();

