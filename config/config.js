require('dotenv').config();

const Port = process.env.NODE_ENV === 'test' ? 4001 : process.env.PORT || 4000;

const MongodbUrl =
  process.env.MONGODB_URL_PRODUCTION ||
  process.env.MONGODB_URI ||
  process.env.MONGODB_URL_DEVELOPMENT ||
  'mongodb://localhost/vero-hospital';

module.exports = {
  Port,
  MongodbUrl,
};