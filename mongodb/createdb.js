var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, (err, db) => {
    if(err) throw err
    let dbo = db.db("todoApp")
    dbo.createCollection('todoList', (err, res) => {
        if(err) throw err
        console.log('collection created ')
        db.close()
    })
})