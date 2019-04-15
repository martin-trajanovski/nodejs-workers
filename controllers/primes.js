/*eslint no-console: ["error", { allow: ["info", "error"] }] */
class PrimesController {
  generatePrimes(start, range, min) {
    const primes = [];
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

    return primes;
  }

  getPrimes() {
    return new Promise(resolve => {
      console.info(`Running on the main thread...`);
      const start = Date.now();
      const min = 2;
      const max = 1e7;
      const primes = this.generatePrimes(min, max, min);
      console.info(`took: ${Date.now() - start}ms`);

      resolve(JSON.stringify({ primes }));
    });
  }
}

module.exports = new PrimesController();
