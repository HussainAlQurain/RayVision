const { MongoClient } = require("mongodb");
require('dotenv').config()

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.k7idjcf.mongodb.net/`;
