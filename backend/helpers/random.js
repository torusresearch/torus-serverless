const rand = require('random-seed')

function generateRandomNumber() {
    const seed = Date.now();
    const randomGenerator = rand.create(seed);
    return randomGenerator(2**50);
}

module.exports = generateRandomNumber