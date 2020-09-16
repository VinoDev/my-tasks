const { MongoClient, ObjectID } = require('mongodb');

const connectURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'my-tasks';

MongoClient.connect(connectURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to the server!');
    }

    const db = client.db(databaseName);

    // db.collection('tasks').insertMany([
    //     {
    //         description: "Meditate",
    //         done: false
    //     },
    //     {
    //         description: "walk the dog",
    //         done: true
    //     }
    // ], (err, data) => {
    //     if(err)
    //         console.log("cant insert bro");

    //     console.log(data.ops);
    // })    


    // db.collection("tasks").deleteOne({
    //     description: "walk the dog"
    // }).then((res) => {
    //     console.log(res);
    // }).catch((err) => {
    //     console.log(err);
    // })

})