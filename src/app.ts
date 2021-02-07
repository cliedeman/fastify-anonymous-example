import fastify from 'fastify';

export const app = fastify({
  logger: false,
});

// Declare a route
app.get('/', function (request, reply) {
  reply.send({hello: 'world'});
});
