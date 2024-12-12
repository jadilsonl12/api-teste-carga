const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Falha ao conectar no redis', err));

(async () => {
  await redisClient.connect();
  console.log('Redis conectado com sucesso');
})();

module.exports = redisClient;
