const mongoose = require('mongoose');
require('dotenv').config();
const { MongodbUrl } = require('./config/config');

const uri = MongodbUrl || process.env.MONGODB_URL_DEVELOPMENT;

if (!uri) {
  console.error(
    'No MongoDB connection string configured. Set MONGODB_URL_DEVELOPMENT or MONGODB_URL_PRODUCTION.'
  );
  process.exit(1);
}

console.log('Testing connection to:', uri.replace(/:[^:@]+@/, ':<redacted>@'));

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB successfully');
    return mongoose.disconnect();
  })
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Connection failed:');
    console.error(err);
    process.exit(1);
  });
