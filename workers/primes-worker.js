const { parentPort, workerData } = require('worker_threads');

let primes = [];

function generatePrimes(start, range, min) {
  let isPrime = true;
  let end = start + range;
  for (let i = start; i < end; i++) {
    for (let j = min; j < Math.sqrt(end); j++) {
      if (i !== j && i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) {
      primes.push(i);
    }
    isPrime = true;
  }
}

parentPort.on('message', () => {
  generatePrimes(workerData.start, workerData.range, workerData.min);
  parentPort.postMessage(primes);
});
