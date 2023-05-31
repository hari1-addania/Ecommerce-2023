import mongoose from "mongoose"

const { MongoClient } = require('mongodb');
const client1 = new MongoClient(process.env.MONGO_URI);
const connectDB = async()=>{
    try {
        const conn =  await client1.connect(process.env.MONGO_URI)
        console.log(`connected to mongoDB ${conn.connection.host}`)
    } catch (error) {
        console.log(`error in mongodb ${error}`)
    }
}

export default connectDB;
