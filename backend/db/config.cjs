const mongoose = require('mongoose');
// mongoose.connect("mongodb://localhost:27017/e-commerce")


const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`mongodb connected: ${conn.connection.host}`.cyan.underline)
  
    } catch (error) {
        console.log(`Error: ${error.message}`.red.bold);
        process.exit();
    }
}

module.exports = connectDB;