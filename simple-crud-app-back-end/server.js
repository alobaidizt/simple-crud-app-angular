const Koa        = require('koa');
const app        = new Koa();
const mongo      = require('koa-mongo');
const ObjectId   = require('mongodb').ObjectID;
const router     = require('koa-router')();
const bodyParser = require('koa-bodyparser');

// Routing

router
  .get('/contacts', function *(next) {
    try {
      var contacts = yield this.mongo.db('test').collection('contacts').find().toArray();
      this.body = { contacts: contacts }
    } catch (err) {
      console.log(err);
      this.body = err;
    }
  })
  .post('/contacts', function *(next) {
    var body = this.request.body
    var id = new ObjectId()
    try {
      yield this.mongo.db('test').collection('contacts').update({_id: id }, body, {upsert: true });
      this.body = { contacts: body };
    } catch (err) {
      console.log(err);
      this.body = err;
    }
  });

// x-response-time

app.use(async function (ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', "Content-Type");
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
