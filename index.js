/*eslint no-console: ["error", { allow: ["info", "error"] }] */
const http = require('http');
const PrimesWorkerController = require('./controllers/primes-using-workers');
const PrimesController = require('./controllers/primes');

const server = http.createServer();

PrimesWorkerController.init();

const onRequest = (request, response) => {
  const { method, url } = request;

  if (method === 'GET' && url === '/get-worker-primes') {
    PrimesWorkerController.getPrimes()
      .then(result => {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(result);
      })
      .catch(error => {
        console.error(error);
        response.statusCode = 500;
        response.end(error);
      });
  } else if (method === 'GET' && url === '/get-primes') {
    PrimesController.getPrimes()
      .then(result => {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(result);
      })
      .catch(error => {
        console.error(error);
        response.statusCode = 500;
        response.end(error);
      });
  }
};

server.on('request', onRequest);

server.listen(1337);
