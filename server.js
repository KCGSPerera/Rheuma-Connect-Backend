// Import necessary modules
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './.env' }); // Ensure the path is correct and the file exists

const app = require('./src/app/app'); // Verify this path matches your project structure

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB and start the server
mongoose.connect(MONGO_URI) // Removed deprecated options
  .then(() => {
    console.log('DB connection successful!');
  })
  .catch(err => {
    console.log('DB connection error:', err);
  });

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
