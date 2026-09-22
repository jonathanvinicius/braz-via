export default () => ({
  app: {
    port: parseInt(process.env.PORT ?? '3333', 10),
    pathPrefix: process.env.PATH_PREFIX ?? 'api',
    corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5174',
    url: process.env.APP_URL ?? 'http://localhost:3333',
  },
});
