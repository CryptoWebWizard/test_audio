
let mongoose = require("mongoose")

let URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/aStream'
exports.connection = async () => {
    try {
        await mongoose.connect(
            URL,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log("Database Connected");

    } catch (error) {
        console.log("Database Connectivity Error", error);
        throw new Error(error);
    }
};

// module.exports = connection;

