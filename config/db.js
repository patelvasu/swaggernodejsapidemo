const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        let connection_url = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
        if (process.env.NODE_ENV !== "localhost") {
          connection_url = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
        }
        await mongoose.connect(connection_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
        return true;
    } catch (err) {
        console.error("MongoDB Connection Error",err.message);
        process.exit(1);
    }
};

module.exports = connectDB;