const Koa        = require('koa');
const app        = new Koa();
const mongo      = require('koa-mongo');
const router     = require('koa-router')();
const bodyParser = require('koa-bodyparser');

// Routing

router
  .get('/contacts', function *(next) {
    this.body = yield this.mongo.db('test').collection('contacts').find().toArray();
  })
  .put('/contact/:id', function *(next) {
    var body = this.request.body
    console.log(body);
    var result = yield this.mongo.db('test').collection('contacts').update({_id: this.params.id }, body, {upsert: true });
    this.body = result;
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
  .use(mongo())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);

module.exports = app;
