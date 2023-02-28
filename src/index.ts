import http from 'http';
import createDebug from 'debug';
import { app } from './app.js';
import { dbConnect } from './db/db.connect.js';

const debug = createDebug('W7CH3: index');
const PORT = process.env.port || 4000;

const server = http.createServer(app);

dbConnect()
.then((mongoose) => {
  server.listen(PORT);
  debug('DB', mongoose.connection.db.databaseName);
})
.catch((error) => server.emit('error', error));

server.on('error', (error) => {
  debug('DB: ', error.message);
});
server.on('listening', () => {
  debug('http://localhost:' + PORT);
})
