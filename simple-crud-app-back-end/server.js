const Koa    = require('koa');
const app    = new Koa();
const mongo  = require('koa-mongo');
const router = require('koa-router')();

// Routing

router
  .get('/contacts', function *(next) {
    this.body = await this.mongo.db('crud').collection('contacts').find().toArray();
  })
  .put('/contact/:id', function *(next) {
    this.body = this.params.id;
  });

// x-response-time

app.use(async function (ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// logger

app.use(async function (ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

app
  .use(mongo({ uri: 'mongodb://localhost:27017/crud' }));
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);
