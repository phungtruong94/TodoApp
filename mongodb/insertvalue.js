var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, (err, db) => {
    if(err) throw err
    const dbo = db.db('todoApp')

    const todoList = [
        {content: 'Work'},
        {content: 'Eat'},
        {content: 'Play'},
        {content: 'Sleep'}
    ]             
    dbo.collection('todoList').insertMany(todoList, (err,res) => {
        if(err) throw err
        console.log('number of doc inserted: ' + res.insertedCount)
        db.close()
    })
})