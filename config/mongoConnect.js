import mongoose from "mongoose"
import "dotenv/config";

const mongoUri = process.env.DB_URI

const connectDatabase = async() => {
    try {
        await mongoose.connect(mongoUri)
        console.log('database connected')
    } catch(error) {
        console.log(error)
    }
}
export default connectDatabase