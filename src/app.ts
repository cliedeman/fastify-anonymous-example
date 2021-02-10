import {
  default as fastify,
  FastifyRequest,
  FastifyReply,
  DoneFuncWithErrOrRes,
} from 'fastify';
import {default as fastifyAuth, skipAuthError} from 'fastify-auth';
import fastifyJwt from 'fastify-jwt';
import bearerAuthPlugin from 'fastify-bearer-auth';

export async function createApp() {
  const app = fastify({
    logger: false,
  });

  await app.register(fastifyAuth);
  app.register(fastifyJwt, {
    secret: 'supersecret',
  });

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

      return done(skipAuthError);
    }
  );

  await app.decorate(
    'allowBearerAuth',
    async function (
      request: FastifyRequest,
      _reply: FastifyReply,
      done: DoneFuncWithErrOrRes
    ) {
      if (request.headers.authorization) {
        try {
          await request.jwtVerify();
          return done();
        } catch (ex) {
          return done(ex);
        }
      }

      return done(skipAuthError);
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
