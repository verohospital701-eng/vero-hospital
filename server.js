const app = require('./app');
const { Port } = require('./config/config');

const server = app.listen(Port, () => {
  console.log(`Server running on Port ${Port}`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${Port} is already in use. Exiting so nodemon can restart.`);
    process.exit(1);
  }
  console.error('Server error:', err);
  process.exit(1);
});
