// index.js
const express = require('express');
const cors = require('cors');
const swaggerUI=require('swagger-ui-express');
const path=require("path");
const connectDB = require('./config/db');
const {swaggerServer,swaggerSetup}=require("./config/swagger");
const {swaggerAdminServer,swaggerAdminSetup}=require("./config/swaggeradmin");
const app = express();

// Load environment variables
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json()); // Parse JSON request bodies

// Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

app.use("/api/swagger",swaggerServer,swaggerSetup);
app.use("/admin/swagger",swaggerAdminServer,swaggerAdminSetup);

app.use('/api-docs-dynamic', function(req, res, next){
  req.swaggerDoc = swaggerDocument;
  next();
}, swaggerUI.serveFiles(), swaggerUI.setup());

app.use(require('./routes/routes'));

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.SERVER_BASE_URL}`);
});