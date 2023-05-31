import mongoose from "mongoose"

import { MongoClient } from 'mongodb';
const client = new MongoClient(process.env.MONGO_URI);


const connectDB = async()=>{
    try {
        const conn =  await client.connect(process.env.MONGO_URI)
        console.log(`connected to mongoDB ${conn.connection.host}`)
    } catch (error) {
        console.log(`error in mongodb ${error}`)
    }
}

export default connectDB;
