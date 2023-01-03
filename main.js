const express = require('express');
const engines = require('consolidate');
const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

const { Int32, ObjectId } = require('mongodb')

var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://0.0.0.0:27017'
app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');

app.post('/search',async (req,res)=>{
    let name = req.body.search
    let client = await MongoClient.connect(url)
    let db = client.db("TungData")
    let results = await db.collection("products").find({'name': new RegExp(name,'i') }).toArray()
    res.render('view',{'results':results})
    
})
app.post('/search2',async (req,res)=>{
    let name = req.body.search
    let client = await MongoClient.connect(url)
    let db = client.db("TungData")
    let results = await db.collection("products2").find({'name': new RegExp(name,'i') }).toArray()
    res.render('view2',{'results':results})
    
})

app.post('/edit',async (req,res)=>{
    let id = req.body.id
    let name = req.body.txtName
    let price = req.body.txtPrice
    let picture = req.body.txtPic
    let client = await MongoClient.connect(url)
    let db = client.db("TungData")
    await db.collection("products").updateOne({ _id: ObjectId(id) },
        { $set: { "name": name, "price": price, "pictureURL": picture } })
    res.redirect('/view')
    
})
app.post('/edit2',async (req,res)=>{
    let id = req.body.id
    let name = req.body.txtName
    let price = req.body.txtPrice
    let picture = req.body.txtPic
    let client = await MongoClient.connect(url)
    let db = client.db("TungData")
    await db.collection("products2").updateOne({ _id: ObjectId(id) },
        { $set: { "name": name, "price": price, "pictureURL": picture } })
    res.redirect('/view2')
    
})

app.get('/edit',async (req,res)=>{
    let id = req.query.id
    let client = await MongoClient.connect(url)
    let db = client.db("TungData")
    const productToEdit = await db.collection("products").findOne({ _id: ObjectId(id) })
    res.render('edit',{product:productToEdit})
})
app.get('/edit2',async (req,res)=>{
    let id = req.query.id
    let client = await MongoClient.connect(url)
    let db = client.db("TungData")
    const productToEdit = await db.collection("products2").findOne({ _id: ObjectId(id) })
    res.render('edit2',{product:productToEdit})
})

app.get('/delete',async (req,res)=>{
    let id = req.query.id
    let client = await MongoClient.connect(url)
    let db = client.db("TungData")
    await db.collection("products").deleteOne({ _id: ObjectId(id) })
    res.redirect('/view')
})
app.get('/delete2',async (req,res)=>{
    let id = req.query.id
    let client = await MongoClient.connect(url)
    let db = client.db("TungData")
    await db.collection("products2").deleteOne({ _id: ObjectId(id) })
    res.redirect('/view2')
})

app.get('/view',async (req,res)=>{
    let client = await MongoClient.connect(url)
    let db = client.db("TungData")
    let results = await db.collection("products").find().toArray()
    res.render('view',{'results':results})
})
app.get('/view2',async (req,res)=>{
    let client = await MongoClient.connect(url)
    let db = client.db("TungData")
    let results = await db.collection("products2").find().toArray()
    res.render('view2',{'results':results})
})

app.post('/new',async (req,res)=>{
    let name = req.body.txtName
    let price = req.body.txtPrice
    let picture = req.body.txtPic
    let newProduct = {
        name : name,
        price: Number.parseInt(price) ,
        pictureURL: picture
    }
    if (name.length > 22) {
        let resultError = {
            nameError: 'You must enter name has length < 22!',
        };
        res.render('newProduct', {  results: resultError });
    }
    else if (isNaN(price)) {
        let resultError1 = {
            priceError: "Enter number"
        };
        res.render('newProduct', { results: resultError1 });
    }
    else {
        let client = await MongoClient.connect(url)
        let db = client.db("TungData")
        await db.collection("products").insertOne(newProduct)
        res.render('view')
    }
})
app.post('/new2',async (req,res)=>{
    let name = req.body.txtName
    let price = req.body.txtPrice
    let picture = req.body.txtPic
    let newProduct = {
        name : name,
        price: Number.parseInt(price) ,
        pictureURL: picture
    }
    if (name.length > 22) {
        let resultError = {
            nameError: 'You must enter name has length < 22!',
        };
        res.render('newProduct2', {  results: resultError });
    }
    else if (isNaN(price)) {
        let resultError1 = {
            priceError: "Enter number"
        };
        res.render('newProduct2', { results: resultError1 });
    }
    else {
        let client = await MongoClient.connect(url)
        let db = client.db("TungData")
        await db.collection("products2").insertOne(newProduct)
        res.render('view2')
    }
})

app.get('/new',(req,res)=>{
    res.render('newProduct')
})
app.get('/new2',(req,res)=>{
    res.render('newProduct2')
})

app.get('/',(req,res)=>{
    res.render('home')
})

const PORT = process.env.PORT || 3000
app.listen(PORT)
console.log("Server is up!")
