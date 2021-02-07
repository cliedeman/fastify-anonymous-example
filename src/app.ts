import {
  default as fastify,
  FastifyRequest,
  FastifyReply,
  DoneFuncWithErrOrRes,
} from 'fastify';
import fastifyAuth from 'fastify-auth';
import bearerAuthPlugin from 'fastify-bearer-auth';

export async function createApp() {
  const app = fastify({
    logger: false,
  });

  await app.register(fastifyAuth);

  await app.decorate(
    'allowAnonymous',
    function (
      request: FastifyRequest,
      _reply: FastifyReply,
      done: DoneFuncWithErrOrRes
    ) {
      if (!request.headers.authorization) {
        return done();
      }

      return done(new Error('not anonymous'));
    }
  );

  await app.decorate(
    'allowBearerAuth',
    function (
      request: FastifyRequest,
      _reply: FastifyReply,
      done: DoneFuncWithErrOrRes
    ) {
      if (request.headers.authorization) {
        // TODO: how to invoke fastify-bearer-auth here
        return done();
      }

      return done(new Error('anonymous'));
    }
  );

  // Declare a route
  await app.route({
    method: 'GET',
    url: '/',
    preHandler: app.auth([
      // @ts-expect-error
      app.allowAnonymous,
      // @ts-expect-error
      app.allowBearerAuth,
    ]),
    handler: (req, reply) => {
      req.log.info('Auth route');
      reply.send({hello: 'world'});
    },
  });

  return app;
}
