/*eslint no-console: ["error", { allow: ["info", "error"] }] */
const { Worker } = require('worker_threads');
const EventEmitter = require('events');

class PrimesWorkerController {
  init() {
    this.min = 2;
    this.primes = [];
    this.max = 1e7;
    this.threadCount = +process.argv[2] || 2;
    this.threads = new Set();
    this.range = Math.ceil((this.max - this.min) / this.threadCount);
    this.myEmitter = new EventEmitter();
    let start = this.min;

    for (let i = 0; i < this.threadCount - 1; i++) {
      const myStart = start;
      this.threads.add(
        new Worker(`${__dirname}/../workers/primes-worker.js`, {
          workerData: { start: myStart, range: this.range, min: this.min }
        })
      );
      start += this.range;
    }

    this.threads.add(
      new Worker(`${__dirname}/../workers/primes-worker.js`, {
        workerData: {
          start,
          range: this.range + ((this.max - this.min + 1) % this.threadCount),
          min: this.min
        }
      })
    );

    for (let worker of this.threads) {
      worker.on('error', err => {
        throw err;
      });
      worker.on('exit', () => {
        this.threads.delete(worker);
        if (this.threads.size === 0) {
          console.info(
            this.primes[0],
            `took: ${Date.now() - this.starttime}ms`
          );
        }
      });
      worker.on('message', msg => {
        this.primes = this.primes.concat(msg);

        if (worker.threadId === this.threadCount) {
          console.info(`took: ${Date.now() - this.starttime}ms`);

          this.myEmitter.emit('primes-calculated', this.primes);
        }
      });
    }
  }

  getPrimes() {
    return new Promise(resolve => {
      this.starttime = Date.now();
      this.primes = [];
      console.info(`Running with ${this.threadCount} threads...`);

      for (let worker of this.threads) {
        worker.postMessage('start');
      }

      this.myEmitter.on('primes-calculated', primes => {
        resolve(JSON.stringify({ primes }));
      });
    });
  }
}

module.exports = new PrimesWorkerController();
