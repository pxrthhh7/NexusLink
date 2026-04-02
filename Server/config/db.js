import mongoose from "mongoose"

const connectDB = async () => {
    try {
        const MONGO_CONN_STRING = process.env.MONGO_URI
        const conn = await mongoose.connect(MONGO_CONN_STRING)
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        process.exit(1);
    }
}

export default connectDB;