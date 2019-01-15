const express = require('express');
const url = "mongodb://localhost:27017/"
const mongo = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 8081;
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.get('/todo-list', (req, res) =>{
    let data = []
    mongo.connect(url, (err, db) => {
        if (err) throw err
        let todoList = db.db('todoApp').collection('todoList').find()
        if(todoList.length === 0){
            db.close()
            res.sendStatus(404)
        }
        todoList.forEach(doc => {
            data.push({
                id: doc._id,
                content: doc.content
            })
        }, () => {
            res.send(data)
            db.close()
        })
    })
})
app.post('/create-item', (req, res) =>{
    if(!req.body.content){
        res.sendStatus(404)
        return
    }
    mongo.connect(url, (err, db) => {
        if(err) throw err
        const dbo = db.db('todoApp')
        dbo.collection('todoList').insertOne({content: req.body.content}, (err, log) =>{
            if(err) throw err
            console.log('number of doc inserted: ' + log.insertedCount)
            res.send('Thành công =)))')
            db.close()
        })
    })
})
app.delete('/delete/item/:id', (req, res) =>{
    var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    if(checkForHexRegExp.test(req.params.id) === false){
        res.sendStatus(404)
        return
    }
    mongo.connect(url, (err, db) => {
        if(err) throw err
        const dbo = db.db('todoApp')
        dbo.collection('todoList').deleteOne({_id: ObjectId(req.params.id)}, (err, log) =>{
            if(err) throw err
            console.log('number of doc deleted: ' + log.deletedCount)
            if(log.deletedCount === 0){
                res.sendStatus(404)
                return
            }
            res.send('Thành công =)))')
            db.close()
        })
    })
})
app.put('/edit', (req, res) => {
    if(!req.body.content || !req.body.id){
        res.sendStatus(404)
    }
    var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    if(checkForHexRegExp.test(req.body.id) === false){
        res.sendStatus(404)
        return
    }
    mongo.connect(url, (err, db) => {
        if(err) throw err
        const dbo = db.db('todoApp')
        let query = {_id: ObjectId(req.body.id)}
        let newContent = {$set: {content: req.body.content}}
        dbo.collection('todoList').updateOne(query, newContent, (err, log) =>{
            if(err) throw err
            res.send('Thành công =)))')
            db.close()
        })
    })
})
app.listen(port, () => console.log(`Listening on port ${port}`));