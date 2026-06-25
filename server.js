const app = require('./app');
const { Port } = require('./config/config');

function startServer(port) {
  const server = app.listen(port, '0.0.0.0', () => {
    const actualPort = server.address().port;
    console.log(`Server running on Port ${actualPort}`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is already in use. Trying a different port...`);
      server.close(() => startServer(0));
      return;
    }
    console.error('Server error:', err);
    process.exit(1);
  });
}

startServer(process.env.PORT || Port);
